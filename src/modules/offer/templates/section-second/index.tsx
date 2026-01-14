import { Metadata } from "next"

import TextImage from "@modules/common/components/text-image"
import Image from "next/image"
import { Heading } from "@modules/common/components/heading"
import { Content } from "@modules/common/components/content"
import { Button } from "@modules/common/components/button"
import Link from "next/link"
import IconCart from "@modules/common/icons/cart"
import { ContentList } from "@modules/common/components/content-list"
import Section from "@modules/common/sections/section"
import { getTranslations } from "next-intl/server"

const ImageBox = async () => {
  const t = await getTranslations("Offer.prepared")
  
  return (
    <Image src="/images/store-hero.png" alt={t("altImage")} width={500} height={500} className="w-full h-full object-cover" />
  )
}

const ContentBox = async () => {
  const t = await getTranslations("Offer.prepared")
  
  return (
    <div>
      <Heading level="h3" gendre="t3" className="mb-4">
        {t("title")}
      </Heading>
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
    <Section spacingTop="primary" spacingBottom="alt">
      <TextImage image={<ImageBox />} content={<ContentBox />} />
    </Section>
  )
}
