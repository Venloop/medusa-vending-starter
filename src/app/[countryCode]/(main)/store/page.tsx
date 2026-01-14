import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import StoreTemplate from "@modules/store/templates"
import { retrieveStore } from "@lib/data/store"
import { notFound } from "next/navigation"
import { pageTitleSufix } from "@lib/constants"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  
  return {
    title: `${t("StoreOnline")} ${pageTitleSufix}`,
    description: `${t("StoreOnline")} ${pageTitleSufix}`,
  }
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sortBy, page } = searchParams
  const sales_channel_id = await retrieveStore()

  if (!sales_channel_id) {
    return notFound()
  }

  return (
    <StoreTemplate
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
      sales_channel_id={sales_channel_id}
    />
  )
}
