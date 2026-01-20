import { CustomerProvider } from "@lib/providers/customer"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { routing } from "../../i18n/routing"

interface Props {
  children: React.ReactNode
  params: { countryCode: string }
}

export default async function CountryLayout({ children, params }: Props) {
  const { countryCode } = await params
  
  if (!hasLocale(routing.locales, countryCode)) {
    notFound()
  }

  // Get messages for the current locale - this re-runs on locale change
  const messages = await getMessages({ locale: countryCode })

  return (
    <NextIntlClientProvider locale={countryCode} messages={messages}>
      <CustomerProvider>
        <main className="relative flex flex-col min-h-screen">
          {children}
        </main>
      </CustomerProvider>
    </NextIntlClientProvider>
  )
}
