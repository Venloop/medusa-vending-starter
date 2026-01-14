import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"
import { pageTitleSufix } from "@lib/constants"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("MetaData")
  
  return {
    title: `${t("accountLoginTitle")} ${pageTitleSufix}`,
    description: t("accountLoginDescription"),
  }
}

export default function Login() {
  return <LoginTemplate />
}
