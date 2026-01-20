import { Suspense } from "react"
import { Button } from "@medusajs/ui"
import Link from "next/link"
import { getTranslations } from "next-intl/server"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@modules/pos-locations/components/refinement-list/sort-products"
import { listProductsWithSort, listVariants } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import VariantPreview from "@modules/products/components/variant-preview"
import { Pagination } from "@modules/store/components/pagination"
import { Heading } from "@modules/common/components/heading"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
  sales_channel_id?: string
  fields?: string
  currency_code?: string
  type_id?: string
}

const Products = async ({
  location,
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
  sales_channel_id
}: {
  location: any
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
  sales_channel_id: string
}) => {
  const t = await getTranslations()
  const queryParams: PaginatedProductsParams = {
    limit: 12,
  }

  queryParams["sales_channel_id"] = sales_channel_id

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  let {
    response: { variants, count },
  } = await listVariants({
    pageParam: page,
    queryParams,
    countryCode,
    sales_channel_id
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)
  const variantsList = variants

  return (
    <>
      <Heading level="h3" gendre="t3" className="mb-12">{t("PosLocationDetail.deviceContent")}</Heading>
      
      <ul
        className="grid grid-cols-2 w-full small:grid-cols-2 medium:grid-cols-4 gap-12 items-stretch"
        data-testid="products-list"
      >
        {variantsList.map((p: any) => {
          return (
            <li key={p.id}>
              <VariantPreview variant={p} product={p.product} url={`/pos/locations/${location.id}/store/variants/${p.id}`} />
            </li>
          )
        })}
      </ul>
      {totalPages > 1 && (
        <Pagination
          data-testid="product-pagination"
          page={page}
          totalPages={totalPages}
        />
      )}
    </>
  )
}

export default Products
