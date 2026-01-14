"use client"

import { passwordUpdate } from "@lib/data/customer"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"
import { useTranslations } from "next-intl"

const UpdatePassword = () => {
  const [message, formAction] = useActionState(passwordUpdate, null)
  const t = useTranslations("UpdatePasswordPage")

  return (
    <div
      className="max-w-sm mx-auto w-full flex flex-col items-center"
      data-testid="update-password-page"
    >
      <h1 className="text-large-semi uppercase mb-6">{t("title")}</h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-8">
        {t("description")}
      </p>
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label={t("passwordLabel")}
            name="password"
            type="password"
            title={t("passwordTitle")}
            autoComplete="password"
            required
            data-testid="password-input"
          />
        </div>
        <SubmitButton data-testid="update-password-button" className="w-full mt-6">
          {t("updateButton")}
        </SubmitButton>
      </form>
    </div>
  )
}

export default UpdatePassword
