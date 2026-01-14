import { Metadata } from "next"

import TextImage from "@modules/common/components/text-image"
import Image from "next/image"
import { Heading } from "@modules/common/components/heading"
import { Content } from "@modules/common/components/content"
import { Button } from "@modules/common/components/button"
import Link from "next/link"
import IconCart from "@modules/common/icons/cart"
import Section from "@modules/common/sections/section"
import { getTranslations } from "next-intl/server"

const ImageBox = async () => {
  const t = await getTranslations("Offer.familyJar")
  
  return (
    <Image src="/images/store-hero.png" alt={t("altImage")} width={500} height={500} className="w-full h-full object-cover" />
  )
}

const ContentBox = async () => {
  const t = await getTranslations("Offer.familyJar")
  
  return (
    <div>
      <Heading level="h2" gendre="t2" className="mb-4">{t("title")}</Heading>
      <Content>
        <p>
          {t("description")}
        </p>
      </Content>
      <Button variant="secondary" asChild className="mt-4">
        <Link href="/pl/store">
          <IconCart className="w-6 h-6" />
          {t("buyOnline")}
        </Link>
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
