"use client"

import { addToCart } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/button"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"

type ProductPreviewActionsProps = {
  product: HttpTypes.StoreProduct
  sales_channel_id: string
  defaultVariant?: HttpTypes.StoreProductVariant
  renderVariantInfo?: (
    selectedVariant: HttpTypes.StoreProductVariant | undefined
  ) => React.ReactNode
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductPreviewActions({
  product,
  sales_channel_id,
  defaultVariant,
  renderVariantInfo,
}: ProductPreviewActionsProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>(
    () => {
      if (defaultVariant) {
        return optionsAsKeymap(defaultVariant.options) ?? {}
      } else if (product.variants?.length === 1) {
        return optionsAsKeymap(product.variants[0].options) ?? {}
      }
      return {}
    }
  )
  const [isAdding, setIsAdding] = useState(false)
  const countryCode = useParams().countryCode as string
  const t = useTranslations()

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  const depositVariant = useMemo(() => {
    const depositVariantId = selectedVariant?.metadata?.deposit_variant_id
    return typeof depositVariantId === "string" ? depositVariantId : undefined
  }, [selectedVariant])

  const inStock = useMemo(() => {
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }

    if (selectedVariant?.allow_backorder) {
      return true
    }

    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }

    return false
  }, [selectedVariant])

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    let metadata: Record<string, string> = {}

    if (depositVariant) {
      metadata.deposit_variant_id = depositVariant
    }

    await addToCart({
      variantId: selectedVariant.id,
      quantity: 1,
      countryCode,
      sales_channel_id,
      metadata,
    })

    if (depositVariant) {
      await addToCart({
        variantId: depositVariant,
        quantity: 1,
        countryCode,
        sales_channel_id,
      })
    }

    setIsAdding(false)
  }

  const hasMultipleVariants = (product.variants?.length ?? 0) > 1

  return (
    <div className="flex flex-col gap-y-3">
      {renderVariantInfo && renderVariantInfo(selectedVariant)}

      {hasMultipleVariants && (
        <div className="flex flex-col gap-y-3">
          {(product.options || []).map((option) => {
            return (
              <div key={option.id}>
                <OptionSelect
                  option={option}
                  current={options[option.id]}
                  updateOption={setOptionValue}
                  title={option.title ?? ""}
                  data-testid="product-options"
                  disabled={isAdding}
                />
              </div>
            )
          })}
        </div>
      )}

      <Button
        onClick={handleAddToCart}
        disabled={!inStock || !selectedVariant || isAdding || !isValidVariant}
        className="w-full"
        isLoading={isAdding}
        data-testid="add-product-button"
      >
        {!selectedVariant && !options
          ? t("SelectVariant")
          : !inStock || !isValidVariant
          ? t("OutOfStock")
          : t("AddToCart")}
      </Button>
    </div>
  )
}
