"use client"
import { useConfirm3DS } from "./useConfirm3Ds"
import { Button } from "@medusajs/ui"
import { useTranslations } from "next-intl"

export function Confirm3DSButton({
  clientSecret,
  onSuccess,
  onAbort,
}: {
  clientSecret: string
  onSuccess?: (pi: any) => void
  onAbort?: (err: any) => void
}) {
  const t = useTranslations()
  const { state, run } = useConfirm3DS(clientSecret, { onSuccess, onAbort })
  return (
    <div data-3ds-state={state}>
      <Button
        onClick={() => run()}
        disabled={state === "processing"}
        size="large"
        className="w-full text-sm"
      >
        {state === "processing" ? t("Payments.confirming") : t("Payments.confirmPayment3DS")}
      </Button>
    </div>
  )
}
