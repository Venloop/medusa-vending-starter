import { getRequestConfig } from "next-intl/server"
import { routing } from "./routing"
import { headers } from "next/headers"

export default getRequestConfig(async ({ requestLocale }) => {
  // Since we use [countryCode] instead of [locale], we need to extract it from the URL
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") || ""
  
  // Extract locale from pathname (e.g., /en/store -> en)
  const segments = pathname.split("/").filter(Boolean)
  const potentialLocale = segments[0]
  
  // Await the requestLocale promise
  const requestedLocale = await requestLocale
  
  let locale = requestedLocale || potentialLocale

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  }
})
