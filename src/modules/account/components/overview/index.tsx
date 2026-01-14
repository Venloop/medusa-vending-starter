"use client"

import { Container } from "@medusajs/ui"


import ChevronDown from "@modules/common/icons/chevron-down"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Heading } from "@modules/common/components/heading"
import { getDate } from "@lib/util/time"
import { useTranslations } from "next-intl"

type OverviewProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  const t = useTranslations("Account.Overview")
  return (
    <div data-testid="overview-page-wrapper">
      <div className="hidden small:block">
        <div className="flex flex-col mb-12">
          <Heading gendre="t5" className="text-grey-60 mb-4" data-testid="welcome-message" data-value={customer?.first_name}>{t("welcome", { name: customer?.first_name || "" })}</Heading>
          
          <p className="text-base text-grey-70">
            {t("loggedInAs")}{" "}
            <span
              className="font-semibold text-grey-60"
              data-testid="customer-email"
              data-value={customer?.email}
            >
              {customer?.email}
            </span>
          </p>
        </div>
        <div className="flex flex-col">
          <div className="flex flex-col gap-y-4 h-full col-span-1 row-span-2 flex-1">
            <div className="grid grid-cols-2 items-start gap-x-16 mb-6">
              <div className="flex flex-col">
                <Heading gendre="t4" className="text-grey-60 mb-4">{t("profileTitle")}</Heading>
                <div className="flex items-center gap-x-4">
                  <span
                    className="text-5xl font-bold text-grey-60 leading-none"
                    data-testid="customer-profile-completion"
                    data-value={getProfileCompletion(customer)}
                  >
                    {getProfileCompletion(customer)}%
                  </span>
                  <span className="text-base">
                    {t("completed")}
                  </span>
                </div>
              </div>

              <div className="flex flex-col">
                <Heading gendre="t4" className="text-grey-60 mb-4">{t("addressesTitle")}</Heading>
                <div className="flex items-center gap-x-4">
                  <span
                    className="text-5xl font-bold text-grey-60 leading-none"
                    data-testid="addresses-count"
                    data-value={customer?.addresses?.length || 0}
                  >
                    {customer?.addresses?.length || 0}
                  </span>
                  <span className="text-base">
                    {t("saved")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-x-2">
                <h3 className="text-large-semi">{t("ordersTitle")}</h3>
              </div>
              <ul
                className="flex flex-col gap-y-4"
                data-testid="orders-wrapper"
              >
                {orders && orders.length > 0 ? (
                  orders.slice(0, 5).map((order) => {
                    return (
                      <li
                        key={order.id}
                        data-testid="order-wrapper"
                        data-value={order.id}
                      >
                        <LocalizedClientLink
                          href={`/account/orders/details/${order.id}`}
                        >
                          <Container className="bg-gray-50 flex justify-between items-center p-4">
                            <div className="grid grid-cols-3 grid-rows-2 text-base gap-x-4 flex-1">
                              <span className="font-semibold text-grey-60">{t("orderDate")}</span>
                              <span className="font-semibold text-grey-60">
                                {t("orderNumber")}
                              </span>
                              <span className="font-semibold text-grey-60">
                                {t("totalAmount")}
                              </span>
                              <span data-testid="order-created-date">
                                {getDate(order.created_at)}
                              </span>
                              <span
                                data-testid="order-id"
                                data-value={order.display_id}
                              >
                                #{order.display_id}
                              </span>
                              <span data-testid="order-amount">
                                {convertToLocale({
                                  amount: order.total,
                                  currency_code: order.currency_code,
                                })}
                              </span>
                            </div>
                            <button
                              className="flex items-center justify-between"
                              data-testid="open-order-button"
                            >
                              <span className="sr-only">
                                {t("goToOrder", { id: order.display_id || 0 })}
                              </span>
                              <ChevronDown className="-rotate-90" />
                            </button>
                          </Container>
                        </LocalizedClientLink>
                      </li>
                    )
                  })
                ) : (
                  <span data-testid="no-orders-message">{t("noOrders")}</span>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const getProfileCompletion = (customer: HttpTypes.StoreCustomer | null) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.first_name && customer.last_name) {
    count++
  }

  if (customer.phone) {
    count++
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr.is_default_billing
  )

  if (billingAddress) {
    count++
  }

  return (count / 4) * 100
}

export default Overview
