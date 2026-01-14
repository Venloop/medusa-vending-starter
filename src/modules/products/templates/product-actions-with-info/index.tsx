"use client"

import { addToCart } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/button"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useTranslations } from "next-intl"
import ProductVariantPrice from "@modules/products/components/product-variant-price"
import { Text } from "@medusajs/ui"
import { getSizeFromOptions } from "@lib/util/variants"
import { getPricesForVariant } from "@lib/util/get-product-price"

type ExtendedStoreProductVariant = HttpTypes.StoreProductVariant & {
  depositVariant?: ExtendedStoreProductVariant
}

type ProductActionsWithInfoProps = {
  product: HttpTypes.StoreProduct
  sales_channel_id: string
  defaultVariant?: HttpTypes.StoreProductVariant
  onVariantChange?: (variant: HttpTypes.StoreProductVariant | undefined) => void
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActionsWithInfo({
  product,
  sales_channel_id,
  defaultVariant,
  onVariantChange,
}: ProductActionsWithInfoProps) {
  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)
  const countryCode = useParams().countryCode as string
  const t = useTranslations()

  useEffect(() => {
    if (defaultVariant) {
      const variantOptions = optionsAsKeymap(defaultVariant.options)
      setOptions(variantOptions ?? {})
    } else if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants, defaultVariant])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options]) as ExtendedStoreProductVariant | undefined

  useEffect(() => {
    if (onVariantChange) {
      onVariantChange(selectedVariant)
    }
  }, [selectedVariant, onVariantChange])

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

  const depositPrice = useMemo(() => {
    return getPricesForVariant((selectedVariant as any)?.depositData)
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
        // metadata,
      })
    }

    setIsAdding(false)
  }

  const hasMultipleVariants = (product.variants?.length ?? 0) > 1

  const variantOptions = useMemo(() => {
    if (!selectedVariant) return []

    const options = [] as string[]
    const kcal = selectedVariant?.metadata?.cms_number_of_kcal
    const portions = selectedVariant?.metadata?.cms_number_of_portions
    const weight = getSizeFromOptions(selectedVariant?.options || [])

    if (kcal) {
      options.push(`${kcal} kcal na 100g`)
    }

    if (portions) {
      options.push(`${portions}`)
    }

    if (weight) {
      options.push(`${weight}g`)
    }

    if (selectedVariant?.inventory_quantity) {
      options.push(`Dostępność: ${selectedVariant?.inventory_quantity}`)
    }

    return options
  }, [selectedVariant])

  return (
    <div className="flex flex-col gap-y-4">
      {variantOptions.length > 0 && (
        <Text
          className="text-xs"
          data-testid="product-variant-options"
          size="small"
        >
          {variantOptions.join(" • ")}
        </Text>
      )}

      <div className="mt-2">
        <ProductVariantPrice variant={selectedVariant} type="regular" />
      </div>

      {depositVariant && (
        <div className="text-sm text-ui-fg-base">
          <span>{t("Deposit")}:</span>
          {` `}
          <span>{depositPrice?.calculated_price}</span>
        </div>
      )}

      {hasMultipleVariants && (
        <div className="flex flex-col gap-y-3 mt-4">
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
        className="w-full mt-4"
        isLoading={isAdding}
        data-testid="add-product-button"
      >
        {!selectedVariant
          ? t("SelectVariant")
          : !inStock || !isValidVariant
          ? t("OutOfStock")
          : t("AddToCart")}
      </Button>
    </div>
  )
}
