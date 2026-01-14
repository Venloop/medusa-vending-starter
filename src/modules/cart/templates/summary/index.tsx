"use client"

import CartTotals from "@modules/common/components/cart-totals"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { useTranslations } from "next-intl"
import { Button } from "@modules/common/components/button"
import IconArrow from "@modules/common/icons/arrow-1-right"
import { Heading } from "@modules/common/components/heading"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)
  const t = useTranslations()

  return (
    <div className="rounded-md md:bg-yellow-50 bg-white md:p-6 p-4 fixed bottom-0 left-0 right-0 w-full md:relative flex flex-col gap-y-6 small:gap-y-8 ">
      <Heading level="h2" gendre="t3">
        {t("Summary")}
      </Heading>
      <DiscountCode cart={cart} />
      <CartTotals totals={cart} />
      <LocalizedClientLink
        href={"/checkout?step=" + step}
        data-testid="checkout-button"
      >
        <Button variant="secondary" className="w-full">
          {t("GoToCheckout")}{" "}
          <IconArrow className="md:w-5 md:h-5 w-3 h-3 shrink-0" />
        </Button>
      </LocalizedClientLink>
    </div>
  )
}

export default Summary
