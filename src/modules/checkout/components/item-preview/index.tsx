"use client"

import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"

import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import CartItemCard from "../../../cart/components/cart-item-card"

import { DEPOSIT_ITEM_TYPE_ID } from "@lib/constants"

type ItemsTemplateProps = {
  cart: HttpTypes.StoreCart
}

const ItemsPreviewTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart.items?.filter((item) => {
    const extendedItem = item as any
    return extendedItem.product_type_id !== DEPOSIT_ITEM_TYPE_ID
  })

  return (
    <div className="py-4 grid grid-cols-1 gap-y-4">
      {items
        ? items
            .sort((a, b) => {
              return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
            })
            .map((item) => {
              return (
                <CartItemCard
                  key={item.id}
                  item={item}
                  currencyCode={cart.currency_code}
                  variant="preview"
                  showQuantityControls={false}
                />
              )
            })
        : repeat(5).map((i) => {
            return <SkeletonLineItem key={i} />
          })}
    </div>
  )
}

export default ItemsPreviewTemplate
