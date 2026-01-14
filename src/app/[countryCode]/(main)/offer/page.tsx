import { Metadata } from "next"
import SectionOne from "@modules/offer/templates/section-one"
import SectionSecond from "@modules/offer/templates/section-second"
import ReturnButton from "@modules/common/components/return-button"
import Section from "@modules/common/sections/section"
import { pageTitleSufix } from "@lib/constants"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("MetaData")
  
  return {
    title: `${t("offerTitle")} ${pageTitleSufix}`,
    description: t("offerDescription"),
  }
}

export default async function OfferPage() {
  return (
    <>
      <Section spacingTop="default" spacingBottom="alt">
        <ReturnButton url="/pl" />
      </Section>
      <SectionOne />
      <SectionSecond />
    </>
  )
}
