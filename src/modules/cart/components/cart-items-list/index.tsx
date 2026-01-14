"use client"

import { HttpTypes } from "@medusajs/types"
import { DEPOSIT_ITEM_TYPE_ID } from "@lib/constants"
import CartItemCard from "@modules/cart/components/cart-item-card"
import { updateLineItem } from "@lib/data/cart"
import { useState } from "react"

type ExtendedCartLineItem = HttpTypes.StoreCartLineItem & {
  product_type_id?: string
}

type CartItemsListProps = {
  items: HttpTypes.StoreCartLineItem[]
  currencyCode: string
  deleteButtonLabel: string
}

const CartItemsList = ({ items, currencyCode, deleteButtonLabel }: CartItemsListProps) => {
  const [updatingItems, setUpdatingItems] = useState<Record<string, boolean>>({})

  const changeQuantity = async (itemId: string, quantity: number) => {
    setUpdatingItems((prev) => ({ ...prev, [itemId]: true }))

    const item = items.find((i) => i.id === itemId)
    const depositVariantId = item?.metadata?.deposit_variant_id as string | undefined

    try {
      await updateLineItem({
        lineId: itemId,
        quantity,
      })

      if (depositVariantId) {
        const depositItem = items.find((i) => i.variant?.id === depositVariantId)

        if (depositItem) {
          setUpdatingItems((prev) => ({ ...prev, [depositItem.id]: true }))
          await updateLineItem({
            lineId: depositItem.id,
            quantity,
          }).finally(() => {
            setUpdatingItems((prev) => ({ ...prev, [depositItem.id]: false }))
          })
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [itemId]: false }))
    }
  }

  const filteredAndSortedItems = items
    .filter((item) => {
      const extendedItem = item as ExtendedCartLineItem
      return extendedItem.product_type_id !== DEPOSIT_ITEM_TYPE_ID
    })
    .sort((a, b) => {
      return (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
    })

  return (
    <div className="py-4 grid grid-cols-1 gap-y-4">
      {filteredAndSortedItems.map((item, index) => (
        <CartItemCard
          key={item.id}
          item={item}
          currencyCode={currencyCode}
          onQuantityChange={changeQuantity}
          isUpdating={updatingItems[item.id]}
          maxQuantity={10}
          showQuantityControls={true}
          showBorder={index < filteredAndSortedItems.length - 1}
          getDeleteItemIds={(item) => {
            const depositVariantId = item.metadata
              ?.deposit_variant_id as string | undefined
            if (depositVariantId) {
              const depositItem = items.find(
                (i) => i.variant?.id === depositVariantId
              )
              return depositItem ? [item.id, depositItem.id] : [item.id]
            }
            return [item.id]
          }}
          deleteButtonLabel={deleteButtonLabel}
        />
      ))}
    </div>
  )
}

export default CartItemsList
