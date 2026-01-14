import { useTranslations } from "next-intl"

import ItemsPreviewTemplate from "@modules/checkout/components/item-preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import { Heading } from "@modules/common/components/heading"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  const t = useTranslations()
  return (
    <div className="rounded-md md:bg-yellow-50 bg-white md:p-6 py-4 flex flex-col gap-y-6 small:gap-y-8">
      <Heading level="h2" gendre="t3">
        {t("InYourCart")}
      </Heading>
      <DiscountCode cart={cart} />
      <CartTotals totals={cart} />
      <ItemsPreviewTemplate cart={cart} />
    </div>
  )
}

export default CheckoutSummary
