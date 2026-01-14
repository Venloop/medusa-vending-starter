import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import CartTemplate from "@modules/cart/templates"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getTranslations } from "next-intl/server"
import { pageTitleSufix } from "@lib/constants"

type Props = {
  params: Promise<{ countryCode: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const t = await getTranslations()
  
  return {
    title: t("Cart") + ` ${pageTitleSufix}`,
    description: t("View your cart"),
  }
}

export default async function Cart() {
  const cart = await retrieveCart().catch((error) => {
    return notFound()
  })

  const customer = await retrieveCustomer()

  return <CartTemplate cart={cart} customer={customer} />
}
