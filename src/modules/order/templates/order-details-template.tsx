"use client"

import { XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import ShippingDetails from "@modules/order/components/shipping-details"
import React from "react"
import { Heading } from "@modules/common/components/heading"
import { Button } from "@modules/common/components/button"
import IconArrow2Left from "@modules/common/icons/arrow-2-left"
import { useTranslations } from "next-intl"

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => {
  const t = useTranslations("Order")

  return (
    <div className="flex flex-col justify-center gap-y-4">
      <div className="flex gap-2 justify-between items-center">
        <Heading gendre="t4" className="text-grey-60">
          {t("orderDetails")}
        </Heading>
        <Button asChild variant="outline" size="small">
          <LocalizedClientLink
            href="/account/orders"
            data-testid="back-to-overview-button"
          >
            <IconArrow2Left className="w-3.5 h-3.5" /> {t("backToOrders")}
          </LocalizedClientLink>
        </Button>
      </div>
      <div
        className="flex flex-col gap-4 h-full w-full"
        data-testid="order-details-container"
      >
        <OrderDetails order={order} showStatus />
        <Items order={order} />
        <ShippingDetails order={order} />
        <OrderSummary order={order} />
      </div>
    </div>
  )
}

export default OrderDetailsTemplate
