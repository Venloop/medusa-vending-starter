"use client"

import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import ProductTags from "@modules/products/components/product-tags"
import { Heading } from "@modules/common/components/heading/heading"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import DeleteButton from "@modules/common/components/delete-button"
import Spinner from "@modules/common/icons/spinner"
import { useTranslations } from "next-intl"

type CartItemCardProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  currencyCode: string
  onQuantityChange?: (itemId: string, quantity: number) => void
  isUpdating?: boolean
  maxQuantity?: number
  showQuantityControls?: boolean
  getDeleteItemIds?: (
    item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  ) => string[]
  deleteButtonLabel?: string
  showBorder?: boolean
  variant?: "default" | "preview"
}

const CartItemCard = ({
  item,
  currencyCode,
  onQuantityChange,
  getDeleteItemIds,
  isUpdating = false,
  maxQuantity = 10,
  deleteButtonLabel = "Remove",
  showQuantityControls = true,
  showBorder = false,
  variant = "default",
}: CartItemCardProps) => {
  const cartItem = item as HttpTypes.StoreCartLineItem
  const deleteItemIds = getDeleteItemIds ? getDeleteItemIds(item) : [item.id]
  const t = useTranslations()

  const isPreview = variant === "preview"
  const gridColsClass = isPreview
    ? "grid-cols-[64px_1fr]"
    : "grid-cols-[64px_1fr] sm:grid-cols-[122px_1fr]"
  const headingGendre = isPreview ? "t6" : "t4"
  const additionalClass = `${
    isPreview
      ? "p-2  bg-white rounded-lg pag-x-1 sm:gap-x-2"
      : "pag-x-2 sm:gap-x-4"
  } ${showBorder ? "pb-4 border-b border-gray-300" : ""}`.trim()

  return (
    <div
      className={`grid items-center ${gridColsClass} ${additionalClass}`}
      data-testid="cart-item"
    >
      <LocalizedClientLink
        href={`/products/${item.product_handle}`}
        className="w-30"
      >
        <Thumbnail
          thumbnail={item.thumbnail}
          images={cartItem.variant?.product?.images}
          size="square"
        />
      </LocalizedClientLink>
      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-end justify-between gap-2">
            <div className="flex flex-col overflow-ellipsis whitespace-nowrap flex-1 min-w-0">
              {cartItem.product?.tags && cartItem.product?.tags.length > 0 && (
                <ProductTags tags={cartItem.product?.tags} className="mb-2" />
              )}
              <LocalizedClientLink
                href={`/products/${item.product_handle}`}
                data-testid="product-link"
              >
                <Heading
                  level="h3"
                  gendre={headingGendre}
                  className="overflow-hidden text-ellipsis"
                >
                  {item.product_title}
                </Heading>
              </LocalizedClientLink>
              <LineItemOptions
                variant={cartItem.variant}
                data-testid="cart-item-variant"
                data-value={cartItem.variant}
              />

              {showQuantityControls && (
                <div className="flex gap-2 items-center mt-3">
                  <CartItemSelect
                    value={item.quantity}
                    onChange={(e) =>
                      onQuantityChange?.(item.id, parseInt(e.target.value))
                    }
                    className="w-14 h-10 p-4"
                    data-testid="cart-item-select"
                  >
                    {Array.from(
                      {
                        length: Math.min(maxQuantity, 10),
                      },
                      (_, i) => (
                        <option value={i + 1} key={i}>
                          {i + 1}
                        </option>
                      )
                    )}
                  </CartItemSelect>
                  {isUpdating && <Spinner />}
                  <DeleteButton
                    id={item.id}
                    data-testid="cart-item-remove-button"
                    groupItemIds={deleteItemIds}
                  >
                    {deleteButtonLabel}
                  </DeleteButton>
                </div>
              )}
            </div>
            <div className="flex flex-col justify-end self-center shrink-0">
              <LineItemPrice
                item={item}
                style={isPreview ? "tight" : "default"}
                currencyCode={currencyCode}
              />
              {!showQuantityControls && (
                <div className="text-sm text-gray-600 self-end">
                  {t("Quantity")}: {item.quantity}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartItemCard
