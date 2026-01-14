import "server-only"
import { cookies as nextCookies } from "next/headers"

export const getCartVenloopId = async () => {
  const cookies = await nextCookies()
  return cookies.get("_medusa_cart_id_venloop")?.value
}

export const setCartVenloopId = async (cartId: string) => {
  const cookies = await nextCookies()
  cookies.set("_medusa_cart_id_venloop", cartId, {
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  })
}

export const removeCartVenloopId = async () => {
  const cookies = await nextCookies()
  cookies.set("_medusa_cart_id_venloop", "", {
    maxAge: -1,
  })
}

