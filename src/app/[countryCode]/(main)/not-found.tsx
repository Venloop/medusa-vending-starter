import { Metadata } from "next"

import InteractiveLink from "@modules/common/components/interactive-link"
import { getTranslations } from "next-intl/server"

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
      <InteractiveLink href="/">{t("GoToFrontpage")}</InteractiveLink>
    </div>
  )
}
