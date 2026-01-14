import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { CustomerProvider } from "@lib/providers/customer"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { notFound } from "next/navigation"
import { routing } from "../../i18n/routing"
import Script from "next/script"
import { Toaster } from "@medusajs/ui"
import "styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

interface Props {
  children: React.ReactNode
  params: { countryCode: string }
}

export default async function RootLayout({ children, params }: Props) {
  const { countryCode } = await params
  if (!hasLocale(routing.locales, countryCode)) {
    notFound()
  }

  return (
    <html lang={countryCode} data-mode="light">
      <body>
        <CustomerProvider>
          <main className="relative flex flex-col min-h-screen">
            <NextIntlClientProvider>{children}</NextIntlClientProvider>
          </main>
        </CustomerProvider>
        <Toaster />
      </body>
    </html>
  )
}
