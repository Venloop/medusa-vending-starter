import React from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductVariantInfo from "@modules/products/components/product-variant-info"
import ProductCmsInfo from "@modules/products/components/product-cms-info"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"  
import LocationInfo from "@modules/products/components/location-info"

type ExtendedStoreProductVariant = HttpTypes.StoreProductVariant & {
  availability?: number
  depositVariant?: HttpTypes.StoreProductVariant
}

type ProductTemplateProps = {
  variant: ExtendedStoreProductVariant
  product: HttpTypes.StoreProduct
  location: any
}

const VariantTemplate: React.FC<ProductTemplateProps> = ({
  variant,
  product,
  location
}) => {
  if (!variant || !variant.id) {
    return notFound()
  }

  const thumbnail = product.thumbnail || null
  const images = product?.images || []

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
            <ProductVariantInfo product={product} variant={variant} />
            <LocationInfo location={location} />
            <ProductCmsInfo product={product} variant={variant} />
          </div>
        </div>
      </div>
    </>
  )
}

export default VariantTemplate
