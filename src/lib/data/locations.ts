"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

export const listLocations = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { locations: any; salesChannels: any; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = (_pageParam === 1) ? 0 : (_pageParam - 1) * limit;

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { locations: [], salesChannels: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("locations")),
  }

  return sdk.client
    .fetch<{ locations: any; salesChannels: any; count: number }>(
      `/store/locations`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          region_id: region?.id,
          ...queryParams,
        },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ salesChannels, locations, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          locations,
          salesChannels,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
}

export const getLocation = async ({
  location_id,
}: {
  location_id: string
}): Promise<{
  response: { location: any }
}> => {
  if (!location_id) {
    throw new Error("Location ID is required")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("location")),
  }

  return sdk.client
    .fetch<{ location: any }>(
      `/store/location`,
      {
        method: "GET",
        query: {
          location_id,
        },
        headers,
        next,
        cache: "force-cache",
      }
    )
    .then(({ location }) => {
      return {
        response: {
          location,
        },
      }
    })
}

