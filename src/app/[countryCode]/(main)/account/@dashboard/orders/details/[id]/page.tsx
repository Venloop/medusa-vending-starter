import { pageTitleSufix } from "@lib/constants"
import { retrieveOrder } from "@lib/data/orders"
import OrderDetailsTemplate from "@modules/order/templates/order-details-template"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const order = await retrieveOrder(params.id).catch(() => null)
  const t = await getTranslations("MetaData")

  if (!order) {
    notFound()
  }

  return {
    title: `${t("orderDetailsTitle")} #${order.display_id} ${pageTitleSufix}`,
    description: t("orderDetailsDescription"),
  }
}

export default async function OrderDetailPage(props: Props) {
  const params = await props.params
  const order = await retrieveOrder(params.id).catch(() => null)

  console.log("🔥 Order:", order)

  if (!order) {
    notFound()
  }

  return <OrderDetailsTemplate order={order} />
}
