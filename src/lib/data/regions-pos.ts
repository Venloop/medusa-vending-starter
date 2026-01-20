"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { getCountryCodeForLocale } from "@lib/util/locale-to-country"
import { HttpTypes } from "@medusajs/types"
import { getCacheOptions } from "./cookies"

export const listRegionsVenloop = async () => {
  const next = {
    ...(await getCacheOptions("regionsVenloop")),
  }

  return sdk.client
    .fetch<{ regions: HttpTypes.StoreRegion[] }>(`/store/regions`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ regions }) => regions)
    .catch(medusaError)
}

export const retrieveRegionVenloop = async (id: string) => {
  const next = {
    ...(await getCacheOptions(["regionsVenloop", id].join("-"))),
  }

  return sdk.client
    .fetch<{ region: HttpTypes.StoreRegion }>(`/store/regions/${id}`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ region }) => region)
    .catch(medusaError)
}

const regionMap = new Map<string, HttpTypes.StoreRegion>()

export const getRegionVenloop = async (countryCode: string) => {
  try {
    // Convert locale to country code (e.g., 'en' -> 'gb')
    const mappedCountryCode = getCountryCodeForLocale(countryCode)
    
    if (regionMap.has(mappedCountryCode)) {
      return regionMap.get(mappedCountryCode)
    }

    const regions = await listRegionsVenloop()

    if (!regions) {
      return null
    }

    regions.forEach((region) => {
      region.countries?.forEach((c) => {
        regionMap.set(c?.iso_2 ?? "", region)
      })
    })

    const region = mappedCountryCode
      ? regionMap.get(mappedCountryCode)
      : regionMap.get("us")

    return region
  } catch (e: any) {
    return null
  }
}
