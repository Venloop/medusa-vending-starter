"use client"

import { resetPassword } from "@lib/data/customer"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"
import { useTranslations } from "next-intl"

const ResetForm = () => {
  const [message, formAction] = useActionState(resetPassword, null)
  const t = useTranslations()

  return (
    <div
      className="max-w-sm mx-auto w-full flex flex-col items-center"
      data-testid="reset-password-page"
    >
      <h1 className="text-large-semi uppercase mb-6">{t("ResetPassword")}</h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-8">
        {t("ResetPasswordDescription")}
      </p>
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Email"
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            data-testid="email-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="reset-password-error-message" />
        <SubmitButton data-testid="reset-password-button" className="w-full mt-6">
          {t("ResetPassword")}
        </SubmitButton>
      </form>
    </div>
  )
}

export default ResetForm
