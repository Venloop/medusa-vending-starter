import { Heading } from "@modules/common/components/heading"
import { Button } from "@modules/common/components/button"
import { Content } from "@modules/common/components/content"
import IconCart from "@modules/common/icons/cart"
import IconOnline from "@modules/common/icons/online"
import Link from "next/link"
import Section from "@modules/common/sections/section"
import { getTranslations } from "next-intl/server"

const Hero = async () => {
  const t = await getTranslations("Home.hero")

  return (
    <Section
      spacingTop="primary"
      spacingBottom="primary"
      className="small:mb-24 md:mb-12 mb-8 bg-yellow-50"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center text-center md:text-left">
        <div>
          <Heading level="h1" gendre="t1" className="md:mb-4 mb-4">
            {t("title")}
          </Heading>

          <Content>
            {t("description")}
          </Content>

          <div className="flex gap-2 md:mt-8 mt-4 justify-center md:justify-start">
            <Button asChild>
              <Link href="/pl/store">
                <IconCart className="md:w-6 md:h-6 w-4 h-4 shrink-0" />
                {t("buyOnline")}
              </Link>
            </Button>

            <Button variant="secondary" asChild>
              <Link href="/pl/pos/locations">
                <IconOnline className="md:w-6 md:h-6 w-4 h-4 shrink-0" />
                {t("buyInStore")}
              </Link>
            </Button>
          </div>
        </div>
        <div>
          <img
            src="/images/store-hero.png"
            alt={t("altImage")}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </Section>
  )
}

export default Hero
