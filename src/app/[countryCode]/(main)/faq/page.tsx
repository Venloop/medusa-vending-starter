import { Metadata } from "next"

import Faq from "@modules/faq"
import Text from "@modules/common/components/accordion/text"
import { getRegion } from "@lib/data/regions"
import { getTranslations } from "next-intl/server"
import { pageTitleSufix } from "@lib/constants"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("MetaData")
  
  return {
    title: `${t("faqTitle")} ${pageTitleSufix}`,
    description: t("faqDescription"),
  }
}

export default async function FaqPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const t = await getTranslations('FaqPage')
  const tQuestions = await getTranslations('FaqPageQuestions')

  const region = await getRegion(countryCode)

  const items = [
    {
      label: tQuestions("question1"),
      component: <Text text={tQuestions("answer1")} />,
    },
    {
      label: tQuestions("question2"),
      component: <Text text={tQuestions("answer2")} />,
    },
  ]

  return (
    <>
      <Faq title={t("title")} items={items} />
    </>
  )
}
