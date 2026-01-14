"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { getAuthHeaders, getCacheOptions, getCacheTag } from "./cookies"
import { revalidateTag } from "next/cache"

export const openVenloop = async (data: {
  device_id: string,
  region_id: string,
  sales_channel_id: string,
  location_id: string,
  hub_id: string,
  locker_id: string,
  mode: string,
  type: string,
}) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const client = await sdk.client
    .fetch<any>(`/store/open-venloop`, {
      method: "POST",
      body: {
        device_id: data.device_id,
        hub_id: data.hub_id,
        locker_id: data.locker_id,
        region_id: data.region_id,
        sales_channel_id: data.sales_channel_id,
        location_id: data.location_id,
        mode: data.mode,
        type: data.type,
      },
      headers,
    })
    .then((data) => data)
    .catch((err) => medusaError(err))

  const cacheTags = await getCacheTag("customers")
  revalidateTag(cacheTags)

  return client
}

export const retryOpenVenloop = async (data: {
  session_id: string
}) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const client = await sdk.client
    .fetch<any>(`/store/retry-open-venloop`, {
      method: "POST",
      body: {
        session_id: data.session_id
      },
      headers,
    })
    .then((data) => data)
    .catch((err) => medusaError(err))

  return client
}

export const closeVenloopComplete = async (data: {
  device_id: string,
  session_id: string,
  mode: string,
  type: string,
}) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const client = await sdk.client
    .fetch<any>(`/store/close-venloop-complete`, {
      method: "POST",
      body: {
        device_id: data.device_id || "",
        session_id: data.session_id || "",
        mode: data.mode || "",
        type: data.type || "",
      },
      headers,
    })
    .then((data) => data)
    .catch((err) => medusaError(err))

  const cacheTags = await getCacheTag("customers")
  revalidateTag(cacheTags)

  return client
}

export const paymentSetupIntent = async (data: {
  user_id: string,
}) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const client = await sdk.client
    .fetch<any>(`/store/payment-create-intent`, {
      method: "POST",
      body: {
        user_id: data.user_id,
      },
      headers,
      cache: "no-store"
    })
    .then((data) => data)
    .catch((err) => medusaError(err))

  return client
}

export const paymentCreateHolder = async (data: {
  user_id: string,
}) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const client = await sdk.client
    .fetch<any>(`/store/payment-create-holder`, {
      method: "POST",
      body: {
        user_id: data.user_id,
      },
      headers,
      cache: "no-store"
    })
    .then((data) => data)
    .catch((err) => medusaError(err))

  return client
}

export const paymentAttachCard = async (data: {
  user_id: string,
  payment_method_id: string,
}) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const client = await sdk.client
    .fetch<any>(`/store/payment-attach-card`, {
      method: "POST",
      body: {
        user_id: data.user_id,
        payment_method_id: data.payment_method_id,
      },
      headers,
      cache: "no-store"
    })
    .then((data) => data)
    .catch((err) => medusaError(err))

  return client
}

export const paymentDetachCard = async (data: {
  payment_method_id: string,
}) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const client = await sdk.client
    .fetch<any>(`/store/payment-detach-card`, {
      method: "POST",
      body: {
        payment_method_id: data.payment_method_id,
      },
      headers,
      cache: "no-store"
    })
    .then((data) => data)
    .catch((err) => medusaError(err))

  return client
}

export const listSessions = async (): Promise<{
  response: {
    sessions: any,
    count: number
  }
  // nextPage: number | null
  queryParams?: any
}> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<{
      sessions: any,
      count: number
    }>(`/store/sessions`, {
      method: "GET",
      query: {},
      headers,
    })
    .then(({ sessions, count }) => {
      console.log("get sessions:", sessions)

      return {
        response: {
          sessions: sessions,
          count: count
        },
        // nextPage: nextPage,
        // queryParams,
      }
    })
}


export const listDepositVariants = async ({
  sales_channel_id,
}: {
  sales_channel_id?: string
}): Promise<{
  response: {
    deposit_variants: any,
    count: number
  }
  // nextPage: number | null
  queryParams?: any
}> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  // const next = {
  //   ...(await getCacheOptions("products")),
  // }

  return sdk.client
    .fetch<{
      deposit_variants: any,
      count: number
    }>(`/store/return/deposits-variants`, {
      method: "GET",
      query: {
        sales_channel_id: sales_channel_id || null,
      },
      headers,
      // next
    })
    .then(({ deposit_variants, count }) => {
      console.log("listDepositVariants:", deposit_variants)

      return {
        response: {
          deposit_variants: deposit_variants,
          count: count
        },
        // nextPage: nextPage,
        // queryParams,
      }
    })
}

