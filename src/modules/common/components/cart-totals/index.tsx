"use client"

import { convertToLocale } from "@lib/util/money"
import React from "react"
import { useTranslations } from "next-intl"
import { DEPOSIT_ITEM_TYPE_ID } from "@lib/constants"
import { HttpTypes } from "@medusajs/types"

type ExtendedCartLineItem = HttpTypes.StoreCartLineItem & {
  product_type_id?: string
}

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    shipping_total?: number | null
    discount_total?: number | null
    gift_card_total?: number | null
    currency_code: string
    shipping_subtotal?: number | null
    items?: HttpTypes.StoreCartLineItem[]
  }
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const { currency_code, total, discount_total, items, shipping_total } = totals

  const t = useTranslations()

  const depositTotal =
    items?.reduce((acc, item) => {
      const extendedItem = item as ExtendedCartLineItem
      if (extendedItem.product_type_id === DEPOSIT_ITEM_TYPE_ID) {
        return acc + (item.total || 0)
      }
      return acc
    }, 0) || 0

  const productsTotal =
    items?.reduce((acc, item) => {
      const extendedItem = item as ExtendedCartLineItem
      if (extendedItem.product_type_id !== DEPOSIT_ITEM_TYPE_ID) {
        return acc + (item.total || 0)
      }
      return acc
    }, 0) || 0

  const productCount =
    items?.reduce((acc, item) => {
      const extendedItem = item as ExtendedCartLineItem
      if (extendedItem.product_type_id !== DEPOSIT_ITEM_TYPE_ID) {
        return acc + item.quantity
      }
      return acc
    }, 0) || 0

  return (
    <div>
      <dl className="grid grid-cols-2 md:gap-2 gap-1">
        <dt className="text-sm font-medium">{t("ProductCount")}</dt>
        <dd className="text-sm text-right font-bold">{productCount}</dd>

        <dt className="text-sm font-medium">{t("ProductsValue")}</dt>
        <dd className="text-sm text-right font-bold">
          {convertToLocale({
            amount: productsTotal,
            currency_code: currency_code,
          })}
        </dd>

        {depositTotal > 0 && (
          <>
            <dt className="text-sm font-medium">{t("Deposit")}</dt>
            <dd className="text-sm text-right font-bold">
              {convertToLocale({
                amount: depositTotal,
                currency_code: currency_code,
              })}
            </dd>
          </>
        )}

        {!!shipping_total && shipping_total > 0 && (
          <>
            <dt className="text-sm font-medium">{t("Delivery")}</dt>
            <dd className="text-sm text-right font-bold">
              {convertToLocale({
                amount: shipping_total || 0,
                currency_code: currency_code,
              })}
            </dd>
          </>
        )}

        {!!discount_total && (
          <>
            <dt className="text-sm font-medium">{t("Discount")}</dt>
            <dd className="text-sm text-right font-bold text-green-600">
              -
              {convertToLocale({
                amount: discount_total,
                currency_code: currency_code,
              })}
            </dd>
          </>
        )}

        <dt className="text-sm font-medium pt-2">{t("ToPay")}</dt>
        <dd className="text-sm text-right font-bold pt-2 ">
          {convertToLocale({
            amount: total ?? 0,
            currency_code: currency_code,
          })}
        </dd>
      </dl>
    </div>
  )
}

export default CartTotals
