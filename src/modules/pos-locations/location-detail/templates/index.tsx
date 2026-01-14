import DetailsLocation from "./details-location"
import Section from "@modules/common/sections/section"
import ReturnButton from "@modules/common/components/return-button"
import Products from "./products"

const LocationDetailsTemplate = ({
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
  return (
    <>
      <Section spacingTop="default" spacingBottom="default">
        <ReturnButton url="/pl/pos/locations" label="Wróć" />
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
