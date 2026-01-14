import { Suspense } from "react"

import { useTranslations } from "next-intl"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { Heading } from "@modules/common/components/heading/heading"
import Section from "@modules/common/sections/section"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  sales_channel_id,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  sales_channel_id: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"
  const t = useTranslations()

  return (
    <Section spacingTop="alt" spacingBottom="alt">
      <div className="w-full flex flex-col justify-between sm:items-center sm:flex-row small:mb-8">
        <Heading level="h1" className="text-xl text-zinc-900">
          {t("ProductList")}
        </Heading>
        <RefinementList sortBy={sort} />
      </div>
      <div className="w-full">
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            sales_channel_id={sales_channel_id}
          />
        </Suspense>
      </div>
    </Section>
  )
}

export default StoreTemplate
