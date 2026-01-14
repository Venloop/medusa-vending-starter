import { Text } from "@medusajs/ui"
import { getTranslations } from "next-intl/server"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Heading } from "@modules/common/components/heading"
import { Button } from "@modules/common/components/button"

const SignInPrompt = async () => {
  const t = await getTranslations("CartPage.SignInPrompt")

  return (
    <div className="bg-white flex items-center justify-between">
      <div>
        <Heading gendre="t4" level="h2" className="txt-xlarge">
          {t("title")}
        </Heading>
        <Text className="txt-medium text-ui-fg-subtle mt-2">
          {t("description")}
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button variant="outline" data-testid="sign-in-button">
            {t("signInButton")}
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
