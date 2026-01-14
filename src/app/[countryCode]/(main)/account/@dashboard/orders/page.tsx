import { Metadata } from "next"

import OrderOverview from "@modules/account/components/order-overview"
import { notFound } from "next/navigation"
import { listOrders } from "@lib/data/orders"
import Divider from "@modules/common/components/divider"
import TransferRequestForm from "@modules/account/components/transfer-request-form"
import { Heading } from "@modules/common/components/heading"
import { Content } from "@modules/common/components/content"
import ReturnDepositOverview from "@modules/account/components/return-deposits"
import { listDepositVariants } from "@lib/data/pos"
import { pageTitleSufix } from "@lib/constants"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("MetaData")
  
  return {
    title: `${t("accountOrdersTitle")} ${pageTitleSufix}`,
    description: t("accountOrdersDescription"),
  }
}

export default async function Orders() {
  const orders = await listOrders()
  const { response: { deposit_variants, count } } = await listDepositVariants({
    sales_channel_id: 'sl1',
  })
  const t = await getTranslations("Account.OrderOverview")

  if (!orders) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="orders-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <Heading gendre="t5" className="text-grey-60 mb-4">{t("ordersPageTitle")}</Heading>
        <Content>
          {t("ordersPageDescription")}
        </Content>
      </div>
      <div>
        <ReturnDepositOverview items={deposit_variants} count={count} />
        <OrderOverview orders={orders} />
        <Divider className="my-16" />
        <TransferRequestForm />
      </div>
    </div>
  )
}
