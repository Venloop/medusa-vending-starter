"use client"

import { useActionState, useState } from "react"
import Input from "@modules/common/components/input"
import Checkbox from "@modules/common/components/checkbox"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const AcceptTermsLabel = () => {
  const t = useTranslations("Account.Register")
  
  return <span className="text-center text-ui-fg-base text-small-regular mt-6">
    {t.rich("acceptTerms", {
      privacyPolicy: (chunks) => (
        <LocalizedClientLink href="/privacy-policy" className="underline">
          {chunks}
        </LocalizedClientLink>
      ),
      terms: (chunks) => (
        <LocalizedClientLink href="/terms" className="underline">
          {chunks}
        </LocalizedClientLink>
      ),
    })}
  </span>
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)
  const t = useTranslations()
  const tRegister = useTranslations("Account.Register")
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect")

  const [checked, setChecked] = useState(false)

  const onChange = () => {
    setChecked(!checked)
  }

  return (
    <div
      className="max-w-sm flex flex-col items-center"
      data-testid="register-page"
    >
      <h1 className="text-large-semi uppercase mb-6">
        {tRegister("becomeMember")}
      </h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-4">
        {tRegister("createProfile")}
      </p>
      <form className="w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label={tRegister("firstNameLabel")}
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
          />
          <Input
            label={tRegister("lastNameLabel")}
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
          />
          <Input
            label={tRegister("emailLabel")}
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />
          <Input
            label={tRegister("phoneLabel")}
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />
          <Input
            label={tRegister("passwordLabel")}
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
          <Checkbox
            label={<AcceptTermsLabel />}
            name="accept_terms"
            required
            onChange={onChange}
            checked={checked}
            data-testid="accept-terms-input"
          />
          {redirect && (
            <input
              type="hidden"
              name="redirect"
              value={redirect}
            />
          )}
        </div>
        <ErrorMessage error={message} data-testid="register-error" />

        <SubmitButton className="w-full mt-6" data-testid="register-button">
          {tRegister("joinButton")}
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        {tRegister("alreadyMember")}{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline"
        >
          {t("SignIn")}
        </button>
        .
      </span>
    </div>
  )
}

export default Register
