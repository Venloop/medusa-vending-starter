
import { pageTitleSufix } from "@lib/constants"
import TextContent from "./text"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

type Props = {
  params: Promise<{ countryCode: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("MetaData")
  
  return {
    title: `${t("privacyPolicyTitle")} ${pageTitleSufix}`,
    description: t("privacyPolicyDescription"),
  }
}

export default async function Page(props: Props) {
  const params = await props.params
  return <TextContent countryCode={params.countryCode} />
  
}
