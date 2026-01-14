import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"

import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"
import CartItemCard from "@modules/cart/components/cart-item-card"

type ItemsProps = {
  order: HttpTypes.StoreOrder
}

const Items = ({ order }: ItemsProps) => {
  const items = order.items

  return (
    <div className="flex flex-col">
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
                    currencyCode={order.currency_code}
                    showQuantityControls={false}
                  />
                )
              })
          : repeat(5).map((i) => {
              return <SkeletonLineItem key={i} />
            })}
      </div>
    </div>
  )
}

export default Items
