"use client"

import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type LineItemPriceProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  style?: "default" | "tight"
  currencyCode: string
}

const LineItemPrice = ({
  item,
  style = "default",
  currencyCode,
}: LineItemPriceProps) => {
  const { total, original_total } = item
  const originalPrice = original_total
  const currentPrice = total
  const hasReducedPrice = currentPrice < originalPrice

  const priceTextSize =
    style === "tight" ? "text-sm md:text-[20px]" : "text-lg md:text-2xl"

  return (
    <div className="flex flex-col text-right">
      {hasReducedPrice && (
        <>
          <span
            className="text-base line-through"
            data-testid="product-original-price"
          >
            {convertToLocale({
              amount: originalPrice,
              currency_code: currencyCode,
            })}
          </span>
          <span
            className={`${priceTextSize} font-bold text-orange-50`}
            data-testid="product-price"
          >
            {convertToLocale({
              amount: currentPrice,
              currency_code: currencyCode,
            })}
          </span>
        </>
      )}
      {!hasReducedPrice && (
        <span
          className={`${priceTextSize} font-bold`}
          data-testid="product-price"
        >
          {convertToLocale({
            amount: currentPrice,
            currency_code: currencyCode,
          })}
        </span>
      )}
    </div>
  )
}

export default LineItemPrice
