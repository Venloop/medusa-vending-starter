import { Metadata } from "next"
import { notFound } from "next/navigation"

import CartsBook from "@modules/account/components/carts-book"

import { getRegion } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"
import { PaymentsProvider } from "@lib/providers/payments"
import { Heading } from "@modules/common/components/heading"
import { Content } from "@modules/common/components/content"
import { pageTitleSufix } from "@lib/constants"
import { getTranslations } from "next-intl/server"
import Payments from "@modules/common/icons/payments"
import { Text } from "@medusajs/ui"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("AccountPage.PaymentCards")

  return {
    title: `${t("title")} ${pageTitleSufix}`,
    description: t("description"),
  }
}

export default async function Carts(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const customer = await retrieveCustomer()
  const region = await getRegion(countryCode)
  const t = await getTranslations("AccountPage.PaymentCards")

  if (!customer || !region) {
    notFound()
  }

  return (
    <PaymentsProvider>
      <div className="w-full" data-testid="addresses-page-wrapper">
        <div className="flex flex-col mb-8">
          <Heading gendre="t5" className="text-grey-60 mb-4">
            {t("title")}
          </Heading>
          <Content>
            <p>{t("intro")}</p>
          </Content>
        </div>
        <CartsBook />
      </div>
    </PaymentsProvider>
  )
}
