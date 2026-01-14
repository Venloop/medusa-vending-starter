import { pageTitleSufix } from "@lib/constants"
import TextContent from "./text"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("MetaData")
  
  return {
    title: `${t("returnsClaimsTitle")} ${pageTitleSufix}`,
    description: t("returnsClaimsDescription"),
  }
}

type Props = {
  params: Promise<{ countryCode: string }>
}

export default async function Page(props: Props) {
  const params = await props.params
  return <TextContent countryCode={params.countryCode} />
  
}
