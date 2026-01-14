import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import CheckoutTemplate from "@modules/checkout/templates"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { pageTitleSufix } from "@lib/constants"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()

  return {
    title: `${t("CheckoutTitle")} ${pageTitleSufix}`,
  }
}

export default async function Checkout() {
  const cart = await retrieveCart().catch((error) => {
    return notFound()
  })

  if (!cart) {
    return notFound()
  }

  const customer = await retrieveCustomer()

  return <CheckoutTemplate cart={cart} customer={customer} />
}
