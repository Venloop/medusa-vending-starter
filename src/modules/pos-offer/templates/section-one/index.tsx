import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

import TextImage from "@modules/common/components/text-image"
import Image from "next/image"
import { Heading } from "@modules/common/components/heading"
import { Content } from "@modules/common/components/content"
import { Button } from "@modules/common/components/button"
import Link from "next/link"
import IconOnline from "@modules/common/icons/online"
import Section from "@modules/common/sections/section"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const ImageBox = async () => {
  const t = await getTranslations("PosOffer.personalJar")
  return (
    <Image src="/images/store-hero.png" alt={t("altImage")} width={500} height={500} className="w-full h-full object-cover" />
  )
}

const ContentBox = async () => {
  const t = await getTranslations("PosOffer.personalJar")
  
  return (
    <div>
      <Heading level="h2" gendre="t2" className="md:mb-4 mb-4">{t("title")}</Heading>
      <Content>
        <p>
          {t("paragraph1")}
        </p>
        <p>
          {t("paragraph2")}
        </p>
      </Content>
      <Button variant="secondary" asChild className="md:mt-4 mt-4">
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
    <Section spacingTop="alt" spacingBottom="primary">
      <TextImage isInverse={true} image={<ImageBox />} content={<ContentBox />} />
    </Section>
  )
}
