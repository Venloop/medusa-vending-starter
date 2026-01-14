import Products from "./products"

const LocationProductsTemplate = ({
  location,
  sortBy,
  page,
  countryCode,
  sales_channel_id
}: {
  location: any
  sortBy?: any
  page?: string
  countryCode: string
  sales_channel_id: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <Products
      location={location}
      sortBy={sortBy}
      page={pageNumber}
      countryCode={countryCode}
      sales_channel_id={sales_channel_id}
    />
  )
}

export default LocationProductsTemplate
