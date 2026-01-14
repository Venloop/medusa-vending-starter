import { Suspense } from "react"
import { getTranslations } from "next-intl/server"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@modules/pos-locations/components/refinement-list/sort-products"

import PaginatedLocations from "./paginated-locations"
import { Heading } from "@modules/common/components/heading"


const LocationsTemplate = async ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const t = await getTranslations("PosLocations")
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="w-full relative">
      <div className="content-container py-8 small:py-12">
        <div className="w-full">
          <Heading
            level="h1"
            gendre="t2"
            className="small:mb-12 mb-8"
          >
            {t("selectLocation")}
          </Heading>
          
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedLocations
              sortBy={sort}
              page={pageNumber}
              countryCode={countryCode}
            />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default LocationsTemplate
