"use client"
import { useStripe } from "@stripe/react-stripe-js"
import { useCallback, useRef, useState, useEffect } from "react"

export function useConfirm3DS(clientSecret: string, {
  onSuccess,
  onAbort,
}: {
  onSuccess?: (pi: any) => void
  onAbort?: (err: any) => void
} = {}) {
  const stripe = useStripe()
  const [state, setState] = useState<"idle"|"processing"|"done"|"incomplete"|"error">("idle")
  const ranRef = useRef(false)

  const run = useCallback(async () => {
    if (!stripe || !clientSecret || ranRef.current) return
    ranRef.current = true
    setState("processing")

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret)

    if (error) {
      setState("incomplete")     // User closed it / not completed
      onAbort?.(error)
      return
    }
    if (paymentIntent?.status === "requires_capture" || paymentIntent?.status === "succeeded") {
      setState("done")
      onSuccess?.(paymentIntent)
      return
    }
    if (paymentIntent?.status === "requires_action") {
      setState("incomplete")
      onAbort?.(new Error("3D Secure not completed"))
      return
    }
    setState("error")
    onAbort?.(new Error(`Unexpected PI status: ${paymentIntent?.status || "unknown"}`))
  }, [stripe, clientSecret, onSuccess, onAbort])

  useEffect(() => { ranRef.current = false }, [clientSecret])

  return { state, run }
}
