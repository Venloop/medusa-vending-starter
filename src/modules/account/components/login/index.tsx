import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)
  const t = useTranslations()
  const tLogin = useTranslations("Account.Login")
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect")

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="login-page"
    >
      <h1 className="text-large-semi uppercase mb-6">{t("WelcomeBack")}</h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-8">
        {t("SignInToAccess")}
      </p>
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label={tLogin("emailLabel")}
            name="email"
            type="email"
            title={tLogin("emailValidation")}
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label={tLogin("passwordLabel")}
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
          {redirect && (
            <input
              type="hidden"
              name="redirect"
              value={redirect}
            />
          )}
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton data-testid="sign-in-button" className="w-full mt-6">
          {t("SignIn")}
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        {tLogin("dontHaveAccount")}{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="underline"
          data-testid="register-button"
        >
          {t("JoinUs")}
        </button>
        .
      </span>
    </div>
  )
}

export default Login
