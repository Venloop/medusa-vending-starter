import { Suspense } from "react"
import { Button } from "@medusajs/ui"
import Link from "next/link"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { SortOptions } from "@modules/pos-locations/components/refinement-list/sort-products"
import { listProductsWithSort, listVariants } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import VariantPreview from "@modules/products/components/variant-preview"
import { Pagination } from "@modules/store/components/pagination"

import { Carousel } from "@modules/pos-locations/components/carousel"
import { useFirestoreDevice } from "@lib/providers/firebase-device"

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
  excludedProductIds,
  countryCode,
  sales_channel_id
}: {
  location: any
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  excludedProductIds?: string[]
  countryCode: string
  sales_channel_id: string
}) => {
  const queryParams: PaginatedProductsParams = {
    limit: 12,
  }

  queryParams["sales_channel_id"] = sales_channel_id
  queryParams["type_id"] = "ptyp_01JZWGSYT31NAZ8D3BZAADWN6E"

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
    <div className="content-container py-6 relative" data-testid="location-details-container">
      <div className="mb-8 text-2xl-semi text-center">
        <h1 data-testid="store-page-title leading-tight"><span className="text-gray-500 text-sm block">Lokalizacja</span><strong>{location.name}</strong></h1>
      </div>

      {location?.metadata?.slider && (
        <div className="mb-8">
          <Carousel images={location?.metadata?.slider} />
        </div>
      )}
      
      <ul
        className="grid grid-cols-2 w-full small:grid-cols-2 medium:grid-cols-4 gap-x-3 medium:gap-x-6 gap-y-8"
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
    </div>
  )
}

export default Products
