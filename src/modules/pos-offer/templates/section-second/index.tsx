import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import TextImage from "@modules/common/components/text-image"
import Image from "next/image"
import { Heading } from "@modules/common/components/heading"
import { Content } from "@modules/common/components/content"
import { Button } from "@modules/common/components/button"
import Link from "next/link"
import IconOnline from "@modules/common/icons/online"
import { ContentList } from "@modules/common/components/content-list"
import Section from "@modules/common/sections/section"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const ImageBox = async () => {
  const t = await getTranslations("PosOffer.prepared")
  return (
    <Image src="/images/store-hero.png" alt={t("altImage")} width={500} height={500} className="w-full h-full object-cover" />
  )
}

const ContentBox = async () => {
  const t = await getTranslations("PosOffer.prepared")
  
  return (
    <div>
      <Heading level="h3" gendre="t3" className="mb-4">{t("title")}</Heading>
      <ContentList items={[
        {
          title: t("feature1")
        },
        {
          title: t("feature2")
        },
        {
          title: t("feature3")
        }
      ]} />
      <Button variant="secondary" asChild className="mt-8">
        <LocalizedClientLink href="/pos/locations">
          <IconOnline className="w-6 h-6" />
          {t("buyInStore")}
        </LocalizedClientLink>
      </Button>      
    </div>
  )
}

export default async function OfferPage() {
  return (
    <Section spacingTop="primary" spacingBottom="alt">
      <TextImage image={<ImageBox />} content={<ContentBox />} />
    </Section>
  )
}
