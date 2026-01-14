import { Metadata } from "next"
import { notFound } from "next/navigation"

import AddressBook from "@modules/account/components/address-book"

import { getRegion } from "@lib/data/regions"
import { retrieveCustomer } from "@lib/data/customer"
import { Heading } from "@modules/common/components/heading"
import { pageTitleSufix } from "@lib/constants"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("AccountPage.Addresses")
  
  return {
    title: `${t("title")} ${pageTitleSufix}`,
    description: t("description"),
  }
}

export default async function Addresses(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const customer = await retrieveCustomer()
  const region = await getRegion(countryCode)
  const t = await getTranslations("AccountPage.Addresses")

  if (!customer || !region) {
    notFound()
  }

  return (
    <div className="w-full" data-testid="addresses-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <Heading gendre="t5" className="text-grey-60 mb-4">{t("title")}</Heading>
        <p className="text-base-regular">
          {t("intro")}
        </p>
      </div>
      <AddressBook customer={customer} region={region} />
    </div>
  )
}
