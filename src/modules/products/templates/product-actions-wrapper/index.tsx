"use client"

import { HttpTypes } from "@medusajs/types"
import ProductActionsWithInfo from "../product-actions-with-info"
import ProductCmsInfo from "@modules/products/components/product-cms-info"
import { useState } from "react"

type ProductActionsWrapperProps = {
  product: HttpTypes.StoreProduct
  sales_channel_id: string
  defaultVariant?: HttpTypes.StoreProductVariant
}

export default function ProductActionsWrapper({
  product,
  sales_channel_id,
  defaultVariant,
}: ProductActionsWrapperProps) {
  const [selectedVariant, setSelectedVariant] = useState<
    HttpTypes.StoreProductVariant | undefined
  >(defaultVariant)

  return (
    <>
      <ProductActionsWithInfo
        product={product}
        sales_channel_id={sales_channel_id}
        defaultVariant={defaultVariant}
        onVariantChange={setSelectedVariant}
      />

      {selectedVariant && (
        <ProductCmsInfo product={product} variant={selectedVariant} />
      )}
    </>
  )
}
