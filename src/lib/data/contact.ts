"use server"

import { sdk } from "@lib/config"
import medusaError from "@lib/util/medusa-error"
import { getAuthHeaders } from "./cookies"

export const contact = async (data: {
  name: string,
  phone: string,
  email: string,
  message: string
}) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const client = await sdk.client
    .fetch<any>(`/store/contact`, {
      method: "POST",
      body: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        message: data.message
      },
      headers,
      cache: "no-store",
    })
    .then((data) => data)
    .catch((err) => medusaError(err))

  return client
}
