import { pageTitleSufix } from "@lib/constants"
import { retrieveOrder } from "@lib/data/orders"
import OrderDetailsTemplate from "@modules/order/templates/order-details-template"
import { Metadata } from "next"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const order = await retrieveOrder(params.id).catch(() => null)

  if (!order) {
    notFound()
  }

  return {
    title: `Zamówienie #${order.display_id} ${pageTitleSufix}`,
    description: `Przeglądaj swoje zamówienie`,
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
