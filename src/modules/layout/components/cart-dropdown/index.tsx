"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/button"
import { DEPOSIT_ITEM_TYPE_ID } from "@lib/constants"

// Extend the type to include product_type_id
type ExtendedCartLineItem = HttpTypes.StoreCartLineItem & {
  product_type_id?: string
}

import ClearCartButton from "@modules/common/components/clear-cart-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartItemCard from "@modules/cart/components/cart-item-card"
import { updateLineItem } from "@lib/data/cart"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import IconCart from "@modules/common/icons/cart-in"
import IconArrow from "@modules/common/icons/arrow-1-right"

const CartDropdown = ({
  cart: cartState,
  disableDropdown = false,
}: {
  cart?: HttpTypes.StoreCart | null
  disableDropdown?: boolean
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)
  const [updatingItems, setUpdatingItems] = useState<Record<string, boolean>>(
    {}
  )

  const open = () => {
    if (!disableDropdown) {
      setCartDropdownOpen(true)
    }
  }
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const total = cartState?.total ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current])

  const t = useTranslations()

  const changeQuantity = async (itemId: string, quantity: number) => {
    setUpdatingItems((prev) => ({ ...prev, [itemId]: true }))

    const item = cartState?.items?.find((i) => i.id === itemId)
    const depositVariantId = item?.metadata?.deposit_variant_id as
      | string
      | undefined

    try {
      await updateLineItem({
        lineId: itemId,
        quantity,
      })

      if (depositVariantId) {
        const depositItem = cartState?.items?.find(
          (i) => i.variant?.id === depositVariantId
        )

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

  const maxQuantity = 10

  const depositTotal =
    cartState?.items?.reduce((acc, item) => {
      const extendedItem = item as ExtendedCartLineItem
      if (extendedItem.product_type_id === DEPOSIT_ITEM_TYPE_ID) {
        return acc + (item.total || 0)
      }
      return acc
    }, 0) || 0

  const productsTotal =
    cartState?.items?.reduce((acc, item) => {
      const extendedItem = item as ExtendedCartLineItem
      if (extendedItem.product_type_id !== DEPOSIT_ITEM_TYPE_ID) {
        return acc + (item.total || 0)
      }
      return acc
    }, 0) || 0

  return (
    <div
      className="h-full z-50"
      onMouseEnter={disableDropdown ? undefined : openAndCancel}
      onMouseLeave={disableDropdown ? undefined : close}
    >
      <Popover className="relative h-full">
        <PopoverButton className="h-full">
          <LocalizedClientLink
            className="flex items-center justify-center gap-1 md:gap-2.5 md:h-14 w-32 md:w-40 bg-yellow-500 text-black md:px-4 md:py-2 px-2 py-2 rounded-lg"
            href="/cart"
            data-testid="nav-cart-link"
          >
            <IconCart className="w-5 h-5 md:w-5 md:h-6 flex-shrink-0" />
            <span className="flex flex-col text-left text-sm md:text-base">
              <span className="text-sm font-normal leading-none mb-1 md:mb-1">{`${t(
                "myCart"
              )}`}</span>
              <span className="text-base font-bold leading-none">
                {convertToLocale({
                  amount: total,
                  currency_code: cartState?.currency_code || "",
                })}
              </span>
            </span>
          </LocalizedClientLink>
        </PopoverButton>
        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel
            static
            className="hidden small:block absolute top-[calc(100%+1px)] right-0 bg-white border-x border-b border-gray-200 w-[640px]  max-w-[95vw] text-ui-fg-base rounded-2xl shadow-lg z-50 p-8"
            data-testid="nav-cart-dropdown"
          >
            <div className="pb-6 flex items-center justify-between border-b border-gray-300">
              <h3 className="text-[20px] font-bold">{t("myCart")}</h3>
              <ClearCartButton className="" data-testid="clear-cart-button">
                {t("removeAll")}
              </ClearCartButton>
            </div>
            {cartState && cartState.items?.length ? (
              <>
                <div className="overflow-y-scroll max-h-[402px] py-6 grid grid-cols-1 gap-y-8 no-scrollbar py-4 border-b border-gray-300">
                  {cartState.items
                    .filter((item) => {
                      const extendedItem = item as ExtendedCartLineItem
                      return (
                        extendedItem.product_type_id !== DEPOSIT_ITEM_TYPE_ID
                      )
                    })
                    .sort((a, b) => {
                      return (a.created_at ?? "") > (b.created_at ?? "")
                        ? -1
                        : 1
                    })
                    .map((item) => (
                      <CartItemCard
                        key={item.id}
                        item={item}
                        currencyCode={cartState.currency_code}
                        onQuantityChange={changeQuantity}
                        isUpdating={updatingItems[item.id]}
                        maxQuantity={maxQuantity}
                        showQuantityControls={true}
                        getDeleteItemIds={(item) => {
                          const depositVariantId = item.metadata
                            ?.deposit_variant_id as string | undefined
                          if (depositVariantId) {
                            const depositItem = cartState.items?.find(
                              (i) => i.variant?.id === depositVariantId
                            )
                            return depositItem
                              ? [item.id, depositItem.id]
                              : [item.id]
                          }
                          return [item.id]
                        }}
                        deleteButtonLabel={t("Remove")}
                      />
                    ))}
                </div>
                <div className="pt-6 flex flex-col gap-y-6">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-ui-fg-base text-sm">
                        {t("ProductsValue")}
                      </span>
                      <span
                        className="text-sm"
                        data-testid="cart-products-value"
                        data-value={productsTotal}
                      >
                        {convertToLocale({
                          amount: productsTotal,
                          currency_code: cartState.currency_code,
                        })}
                      </span>
                    </div>
                    {depositTotal > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-ui-fg-base text-sm">
                          {t("Deposit")}
                        </span>
                        <span
                          className="text-sm"
                          data-testid="cart-deposit"
                          data-value={depositTotal}
                        >
                          {convertToLocale({
                            amount: depositTotal,
                            currency_code: cartState.currency_code,
                          })}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-ui-fg-base font-bold text-base">
                        {t("totalValue")}
                      </span>
                      <span
                        className="font-bold text-xl"
                        data-testid="cart-total"
                        data-value={total}
                      >
                        {convertToLocale({
                          amount: total,
                          currency_code: cartState.currency_code,
                        })}
                      </span>
                    </div>
                  </div>

                  <LocalizedClientLink href="/cart" passHref>
                    <Button
                      variant="secondary"
                      className="w-full"
                      asChild
                      data-testid="go-to-cart-button"
                    >
                      <div>
                        <IconCart className="md:w-6 md:h-6 w-4 h-4 shrink-0" />
                        {t("GoToCart")}
                        <IconArrow className="md:w-5 md:h-5 w-3 h-3 shrink-0" />
                      </div>
                    </Button>
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div>
                <div className="flex py-16 flex-col gap-y-4 items-center justify-center">
                  <div className="bg-gray-900 text-small-regular flex items-center justify-center w-6 h-6 rounded-full text-white">
                    <span>0</span>
                  </div>
                  <span>{t("YourShoppingBagIsEmpty")}</span>
                  <div>
                    <LocalizedClientLink href="/store">
                      <>
                        <span className="sr-only">
                          {t("GoToAllProductsPage")}
                        </span>
                        <Button onClick={close}>{t("ExploreProducts")}</Button>
                      </>
                    </LocalizedClientLink>
                  </div>
                </div>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
