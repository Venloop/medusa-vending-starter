"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { getCacheOptions } from "./cookies"

export const retrieveStore = async (): Promise<string | undefined> => {
  const next = {
    ...(await getCacheOptions(["store"].join("-"))),
  }

  return sdk.client
    .fetch<{ sales_channel_id: string }>(`/store/store`, {
      method: "GET",
      next,
      cache: "force-cache",
    })
    .then(({ sales_channel_id }) => sales_channel_id)
    .catch(medusaError)
}
