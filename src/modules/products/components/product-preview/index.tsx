"use client"

import { Text } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { getPricesForVariant } from "@lib/util/get-product-price"
import ProductTags from "../product-tags"
import { Heading } from "@modules/common/components/heading"
import { getSizeFromOptions } from "@lib/util/variants"
import ProductPreviewActions from "../product-preview-actions"
import { useMemo } from "react"
import { useTranslations } from "next-intl"

type ExtendedStoreProductVariant = HttpTypes.StoreProductVariant & {
  availability?: number
  depositData?: HttpTypes.StoreProductVariant
}

const getVariantOptions = (
  product: HttpTypes.StoreProduct,
  variant: ExtendedStoreProductVariant,
  cms_expiry_date?: any,
  depositPrice?: any,
  t?: any
): { main: string[]; secondary: string[] } => {
  const main: string[] = []
  const secondary: string[] = []

  const kcal = variant?.metadata?.cms_number_of_kcal
  const portions = variant?.metadata?.cms_number_of_portions
  const weight = getSizeFromOptions(variant?.options || [])

  if (kcal) {
    main.push(`${kcal} ${t?.("ProductVariantInfo.kcalPer100g") || "kcal na 100g"}`)
  }

  if (portions) {
    main.push(`${portions}`)
  }

  if (weight) {
    main.push(`${weight}g`)
  }

  if (depositPrice) {
    secondary.push(`${t?.("ProductVariantInfo.deposit") || "Kaucja"}: ${depositPrice?.calculated_price}`)
  }

  if (variant?.availability !== null && variant?.availability !== undefined) {
    secondary.push(`${t?.("ProductVariantInfo.availability") || "Dostępność"}: ${variant?.availability}`)
  }

  if (cms_expiry_date?.length) {
    secondary.push(`${t?.("ProductVariantInfo.expiryDates") || "Terminy"}: ${Object.values(cms_expiry_date).join(", ")}`)
  }

  return {
    main: main.filter((option) => option),
    secondary: secondary.filter((option) => option),
  }
}

export default function ProductPreview({
  product,
  isFeatured,
  region,
  url,
  sales_channel_id,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
  url?: string
  sales_channel_id: string
}) {
  const t = useTranslations()
  const getAvailableVariant = (variants: any[]) => {
    const inStockVariant = variants.find((v: any) => {
      if (!v.manage_inventory) return true
      if (v.allow_backorder) return true
      return v.inventory_quantity > 0
    })

    if (inStockVariant) return inStockVariant

    return variants[0]
  }

  const defaultVariant: ExtendedStoreProductVariant | undefined =
    useMemo(() => {
      const variants = product.variants?.filter(
        (v: any) => !!v.calculated_price
      )
      if (!variants || variants.length === 0) return undefined

      return getAvailableVariant(variants)
    }, [product.variants])

  const productTitle = product?.title
  const tags = product?.tags || []

  return (
    <div className="flex flex-col h-full">
      <LocalizedClientLink href={url || `/products/${product.handle}`}>
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="square"
        />
      </LocalizedClientLink>
      <div className="flex-1">
        {tags.length > 0 && <ProductTags tags={tags} className="mt-2 mb-4" />}
        <div className="">
          <LocalizedClientLink href={url || `/products/${product.handle}`}>
            <Heading level="h3" gendre="t4">
              {productTitle}
            </Heading>
          </LocalizedClientLink>
          <ProductPreviewActions
            product={product}
            sales_channel_id={sales_channel_id}
            defaultVariant={defaultVariant}
            renderVariantInfo={(selectedVariant) => {
              if (!selectedVariant) return null

              const depositPrice = getPricesForVariant(
                (selectedVariant as any)?.depositData
              )
              const variantPrice = getPricesForVariant(selectedVariant)
              const cms_expiry_date =
                selectedVariant?.metadata?.cms_expiry_date || []
              const { main: mainOptions, secondary: secondaryOptions } =
                getVariantOptions(
                  product,
                  selectedVariant as ExtendedStoreProductVariant,
                  cms_expiry_date,
                  depositPrice,
                  t
                )

              return (
                <>
                  {mainOptions.length > 0 && (
                    <Text
                      className="text-xs mt-1"
                      data-testid="product-title"
                      size="small"
                    >
                      {mainOptions.join(" • ")}
                    </Text>
                  )}
                  <div className="mt-2">
                    <div className="mb-0.5">
                      {variantPrice && <PreviewPrice price={variantPrice} />}
                    </div>
                    {secondaryOptions.length > 0 && (
                      <Text
                        className="text-xs"
                        data-testid="product-secondary-info"
                      >
                        {secondaryOptions.join(", ")}
                      </Text>
                    )}
                  </div>
                </>
              )
            }}
          />
        </div>
      </div>
    </div>
  )
}
