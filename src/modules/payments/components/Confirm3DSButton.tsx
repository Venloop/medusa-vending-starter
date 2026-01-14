"use client"
import { useConfirm3DS } from "./useConfirm3Ds"
import { Button } from "@medusajs/ui"

export function Confirm3DSButton({
  clientSecret,
  onSuccess,
  onAbort,
}: {
  clientSecret: string
  onSuccess?: (pi: any) => void
  onAbort?: (err: any) => void
}) {
  const { state, run } = useConfirm3DS(clientSecret, { onSuccess, onAbort })
  return (
    <div data-3ds-state={state}>
      <Button
        onClick={() => run()}
        disabled={state === "processing"}
        size="large"
        className="w-full text-sm"
      >
        {state === "processing" ? "Potwierdzanie…" : "Potwierdź płatność (3DS)"}
      </Button>
    </div>
  )
}
