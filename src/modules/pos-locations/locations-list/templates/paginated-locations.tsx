import { listLocations } from "@lib/data/locations"
import LocationPreview from "@modules/locations/components/location-preview"
import { SortOptions } from "@modules/pos-locations/components/refinement-list/sort-products"

type PaginatedLocationsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
  sales_channel_id?: string
}

export default async function PaginatedLocations({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  countryCode: string
}) {
  const queryParams: PaginatedLocationsParams = {
    limit: 12,
  }

  let {
    response: { salesChannels, locations, count },
  } = await listLocations({
    pageParam: page,
    queryParams,
    countryCode,
  })

  return (
    <>
      <ul
        className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-3 gap-4"
        data-testid="products-list"
      >
        {locations.map((location: any) => {
          return (
            <li key={location.id}>
              <LocationPreview location={location} />
            </li>
          )
        })}
      </ul>
    </>
  )
}
