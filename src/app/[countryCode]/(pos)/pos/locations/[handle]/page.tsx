import { Metadata } from "next"

import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import LocationDetailsTemplate from "@modules/pos-locations/location-detail/templates"
import { getLocation } from "@lib/data/locations"
import { pageTitleSufix } from "@lib/constants"
import { getTranslations } from "next-intl/server"

type MetaProps = {
  params: Promise<{
    countryCode: string
    handle: string
  }>
}

export async function generateMetadata(props: MetaProps): Promise<Metadata> {
  const { handle } = await props.params
  const t = await getTranslations("MetaData")

  const location = await getLocation({
    location_id: handle,
  }).then(({ response }) => response.location[0])

  return {
    title: location?.name
      ? `${t("posLocationTitle")} ${location.name} ${pageTitleSufix}`
      : `${t("posLocationTitle")} ${pageTitleSufix}`,
    description: location?.name
      ? `${t("posLocationTitle")} ${location.name}`
      : `${t("posLocationTitle")} ${pageTitleSufix}`,
  }
}

type Params = {
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
  params: Promise<{
    countryCode: string
    handle: string
  }>
}

export default async function LocationInfoPage(props: Params) {
  const { countryCode, handle } = await props.params
  const searchParams = await props.searchParams
  const { sortBy, page } = searchParams

  const location = await getLocation({
    location_id: handle,
  }).then(({ response }) => response.location[0])

  return (
    <LocationDetailsTemplate
      location={location}
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
      sales_channel_id={location.sales_channels[0].id}
    />
  )
}
