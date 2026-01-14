import { clx } from "@medusajs/ui"

import { getProductPrice, getPricesForVariant } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { useTranslations } from "next-intl"

export default function VariantPrice({
  variant,
  className,
  type,
}: {
  variant?: HttpTypes.StoreProductVariant
  className?: string
  type?: "deposit" | "regular"
}) {
  const t = useTranslations()
  const selectedPrice = variant

  if (!selectedPrice) {
    return <div className="block w-32 h-9 bg-gray-100 animate-pulse" />
  }

  const price = getPricesForVariant(selectedPrice)

  return (
    <div className="flex flex-col text-ui-fg-base">
      <span
        className={
          clx(
            {
              "text-base-semi": type === "deposit",
              "text-2xl font-bold": type === "regular",
            },
            {
              "text-base line-through": price?.price_type === "sale",
            }, 
            className
          )
        }
      >
        {!variant && "From "}
        <span
          data-testid="product-price"
          data-value={price?.calculated_price_number}
        >
          {type === "deposit" && <>
            {t('Deposit')}: {price?.calculated_price}
          </>}
          {type === "regular" && price?.calculated_price}
        </span>
      </span>
      {selectedPrice.price_type === "sale" && (
        <>
          <p>
            <span className="text-ui-fg-subtle">Original: </span>
            <span
              className="line-through"
              data-testid="original-product-price"
              data-value={selectedPrice.original_price_number}
            >
              {selectedPrice.original_price}
            </span>
          </p>
          <span className="text-ui-fg-interactive">
            -{selectedPrice.percentage_diff}%
          </span>
        </>
      )}
    </div>
  )
}
