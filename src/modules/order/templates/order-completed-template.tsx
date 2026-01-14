import { cookies as nextCookies } from "next/headers"
import { Heading } from "@modules/common/components/heading"
import Divider from "@modules/common/components/divider"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"
import { getTranslations } from "next-intl/server"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()
  const t = await getTranslations("Order")

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"

  return (
    <div className="py-6 min-h-[calc(100vh-64px)]">
      <div className="content-container flex flex-col justify-center items-center gap-y-10 max-w-4xl h-full w-full">
        {isOnboarding && <OnboardingCta orderId={order.id} />}
        <div
          className="flex flex-col gap-4 max-w-4xl h-full bg-white w-full py-10"
          data-testid="order-complete-container"
        >
          <Heading
            level="h1"
            gendre="t2"
            className="flex flex-col gap-y-3 text-ui-fg-base text-3xl mb-8 text-center"
          >
            <span>{t("goodChoice")}</span>
          </Heading>
          <OrderDetails order={order} />
          <Heading
            level="h2"
            gendre="t4"
            className="flex flex-row text-3xl-regular"
          >
            {t("summary")}
          </Heading>
          <CartTotals totals={order} />
          <Divider className="my-4" />
          <Heading
            level="h2"
            gendre="t4"
            className="flex flex-row text-3xl-regular mt-2"
          >
            {t("selectedProducts")}
          </Heading>
          <Items order={order} />
          <Divider className="my-4" />
          <ShippingDetails order={order} />
          <PaymentDetails order={order} />
          <Help />
        </div>
      </div>
    </div>
  )
}
