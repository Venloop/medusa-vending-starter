import DetailsLocation from "./details-location"
import Section from "@modules/common/sections/section"
import ReturnButton from "@modules/common/components/return-button"
import Products from "./products"
import { getTranslations } from "next-intl/server"

const LocationDetailsTemplate = async ({
  location,
  sortBy,
  page,
  countryCode,
  sales_channel_id
}: {
  location: any
  sortBy: any
  page: any
  countryCode: any
  sales_channel_id: any
}) => {
  const t = await getTranslations()
  
  return (
    <>
      <Section spacingTop="default" spacingBottom="default">
        <ReturnButton url="/pl/pos/locations" label={t("Common.back")} />
      </Section>
      <Section spacingTop="default" spacingBottom="primary">
        <DetailsLocation location={location} />
      </Section>
      <Section spacingTop="default" spacingBottom="primary">
        <Products
          location={location}
          sortBy={sortBy}
          page={page}
          countryCode={countryCode}
          sales_channel_id={sales_channel_id}     
        />
      </Section>
    </>
  )
}

export default LocationDetailsTemplate
