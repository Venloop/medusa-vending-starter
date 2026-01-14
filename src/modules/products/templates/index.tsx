import React from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { Heading } from "@modules/common/components/heading"
import ProductTags from "@modules/products/components/product-tags"
import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  location?: any
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  sales_channel_id: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  location,
  product,
  region,
  countryCode,
  sales_channel_id,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  const getAvailableVariant = (variants: any[]) => {
    const inStockVariant = variants.find((v: any) => {
      if (!v.manage_inventory) return true
      if (v.allow_backorder) return true
      return v.inventory_quantity > 0
    })

    if (inStockVariant) return inStockVariant
    return variants[0]
  }

  const variants = product.variants?.filter((v: any) => !!v.calculated_price)
  const defaultVariant =
    variants && variants.length > 0 ? getAvailableVariant(variants) : undefined

  const thumbnail = product.thumbnail || null
  const images = product?.images || []
  const productTitle = product?.title
  const tags = product?.tags || []

  return (
    <>
      <div
        className="content-container flex flex-col small:flex-row small:items-start py-6 relative"
        data-testid="product-container"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
          <div className="">
            <div className="block w-full relative mb-3">
              <ImageGallery images={images} thumbnail={thumbnail} />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex-1">
              {tags.length > 0 && (
                <ProductTags tags={tags} className="mt-2 mb-4" />
              )}
              <div className="">
                <Heading level="h3" gendre="t2" className="mb-4">
                  {productTitle}
                </Heading>
              </div>
            </div>

            <ProductActionsWrapper
              product={product}
              sales_channel_id={sales_channel_id}
              defaultVariant={defaultVariant}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductTemplate
