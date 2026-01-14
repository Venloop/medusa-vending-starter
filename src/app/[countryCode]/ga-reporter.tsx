"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function GAReporter() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname) return
    // Wait for GA to be available
    const url = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`
    // page_view for GA4
    // @ts-expect-error gtag is injected by GA script
    window.gtag?.("event", "page_view", {
      page_path: pathname,
      page_location: typeof window !== "undefined" ? window.location.href : undefined,
      page_title: document.title,
    })
    // Also push to dataLayer for GTM setups if present
    ;(window as any).dataLayer?.push({
      event: "pageview",
      page: url,
    })
  }, [pathname, searchParams])

  return null
}


