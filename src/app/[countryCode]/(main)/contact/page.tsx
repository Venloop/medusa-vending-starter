import { Metadata } from "next"

import Contact from "@modules/contact"
import { getTranslations } from "next-intl/server"
import { pageTitleSufix } from "@lib/constants"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("MetaData")
  
  return {
    title: `${t("contactTitle")} ${pageTitleSufix}`,
    description: t("contactDescription"),
  }
}

export default async function ContactPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const t = await getTranslations('ContactPage')

  return (
    <>
      <Contact title={t("title")} />
    </>
  )
}
