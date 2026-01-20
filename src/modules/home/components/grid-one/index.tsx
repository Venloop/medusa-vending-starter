import { Github } from "@medusajs/icons"
import { Heading } from "@modules/common/components/heading"
import { Content } from "@modules/common/components/content"
import { Button } from "@modules/common/components/button"
import IconArrowRight from "@modules/common/icons/arrow-1-right"
import Link from "next/link"
import Box from "./box"
import Section from "@modules/common/sections/section"
import { getTranslations } from "next-intl/server"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const GridOne = async () => {
  const t = await getTranslations("Home.gridOne")

  return (
    <Section spacingTop="primary" spacingBottom="primary">
      <header className="small:mb-12 mb-8 text-center">
        <Heading level="h1" gendre="t1" className="text-center text-black">
          {t("title")}
        </Heading>
      </header>

      <div className="grid small:grid-cols-2 grid-cols-1 small:gap-6 gap-4 gap-y-8 items-stretch">
        <Box
          title={t("familyJar.title")}
          subTitle={t("familyJar.subtitle")}
        >
          <Content>
            <ul>
              <li>{t("familyJar.feature1")}</li>
              <li>{t("familyJar.feature2")}</li>
              <li>{t("familyJar.feature3")}</li>
            </ul>
          </Content>
          <div className="md:mt-8 mt-4">
            <Button variant="secondary" asChild>
              <LocalizedClientLink href="/offer">
                {t("familyJar.button")}
                <IconArrowRight className="w-4 h-4" />
              </LocalizedClientLink>
            </Button>
          </div>
        </Box>
        <Box
          title={t("personalJar.title")}
          subTitle={t("personalJar.subtitle")}
        >
          <Content className="flex-1">
            <ul>
              <li>{t("personalJar.feature1")}</li>
              <li>{t("personalJar.feature2")}</li>
              <li>{t("personalJar.feature3")}</li>
            </ul>
          </Content>
          <div className="mt-8">
            <Button asChild>
              <LocalizedClientLink href="/pos/offer">
                {t("personalJar.button")}
                <IconArrowRight className="w-4 h-4" />
              </LocalizedClientLink>
            </Button>
          </div>
        </Box>
      </div>
    </Section>
  )
}

export default GridOne
