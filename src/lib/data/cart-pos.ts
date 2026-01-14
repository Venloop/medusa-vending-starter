"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"

import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getCartVenloopId } from "./cookies-pos"

/**
 * Retrieves a cart by its ID. If no ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to retrieve.
 * @returns The cart object if found, or null if not found.
 */
export async function retrieveCartVenloop(cartId?: string) {
  const id = cartId || (await getCartVenloopId())

  if (!id) {
    return null
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("cartsVenloop")),
  }

  const cart = await sdk.client
    .fetch<HttpTypes.StoreCartResponse>(`/store/carts/${id}`, {
      method: "GET",
      query: {
        fields:
          "*items, *region, *items.product,*items.product.tags, *items.variant,*items.variant.options, *items.thumbnail, *items.metadata, +items.total",
      },
      headers,
      next,
      cache: "no-store",
    })
    .then(({ cart }) => cart)
    .catch(() => null)

  return cart
}

/**
 * Retrieves a cart by its ID. If no ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to retrieve.
 * @returns The cart object if found, or null if not found.
 */
export async function retrieveCartReturnVenloop(cartId?: string) {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("cartsVenloop")),
  }

  const cart = await sdk.client
    .fetch<HttpTypes.StoreCartResponse>(`/store/return/carts/${cartId}`, {
      method: "GET",
      headers,
      next,
      cache: "no-store",
    })
    .then(({ cart }) => cart)
    .catch(() => null)

  return cart
}
