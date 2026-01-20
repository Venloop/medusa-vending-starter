import { ArrowUpRightMini } from "@medusajs/icons"
import { Text } from "@medusajs/ui"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  
  return {
    title: t("NotFoundTitle"),
    description: t("NotFoundDescription"),
  }
}

export default async function NotFound() {
  const t = await getTranslations()
  
  return (
    <div className="flex flex-col gap-4 items-center justify-center min-h-[calc(100vh-64px)]">
      <h1 className="text-2xl-semi text-ui-fg-base">{t("NotFoundHeading")}</h1>
      <p className="text-small-regular text-ui-fg-base">
        {t("NotFoundText")}
      </p>
      <LocalizedClientLink
        className="flex gap-x-1 items-center group"
        href="/"
      >
        <Text className="text-ui-fg-interactive">{t("GoToFrontpage")}</Text>
        <ArrowUpRightMini
          className="group-hover:rotate-45 ease-in-out duration-150"
          color="var(--fg-interactive)"
        />
      </LocalizedClientLink>
    </div>
  )
}
