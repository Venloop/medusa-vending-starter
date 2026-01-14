import { HttpTypes } from "@medusajs/types"
import CheckoutForm from "./checkout-form"
import CheckoutSummary from "./checkout-summary"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button } from "@modules/common/components/button"
import IconArrow from "@modules/common/icons/arrow-2-left"
import { useTranslations } from "next-intl"

const CheckoutTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const t = useTranslations()

  if (!cart) {
    return null
  }

  return (
    <div className="py-6 md:py-12">
      <div className="content-container" data-testid="checkout-container">
        <div className="grid grid-cols-1 small:grid-cols-[1fr_480px] gap-x-12 gap-y-2">
          <div className="grid grid-cols-1 gap-y-8">
            <LocalizedClientLink href="/cart">
              <Button variant="outline" data-testid="back-to-cart-button">
                <IconArrow size={15} className="shrink-0" />
                {t("BackToCart")}
              </Button>
            </LocalizedClientLink>
            <PaymentWrapper cart={cart}>
              <CheckoutForm cart={cart} customer={customer} />
            </PaymentWrapper>
          </div>
          <div className="relative">
            <div className="flex flex-col gap-y-8 sticky">
              <CheckoutSummary cart={cart} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutTemplate
