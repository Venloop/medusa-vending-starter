import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js"

import { Button } from "@modules/common/components/button"
import { Heading } from "@modules/common/components/heading"

import { paymentAttachCard } from "@lib/data/pos"
import { usePayments } from "@lib/providers/payments"
import StripeCardElementWrapper from "@modules/payments/components/stripe-card-element-wrapper"
import { useState } from "react"
import { useTranslations } from "next-intl"

export default function StripeCardAddForm({
  clientSecret,
  user_id,
  onPaymentCreated,
}: {
  clientSecret: string
  user_id: string
  onPaymentCreated: (paymentCreated: boolean) => void
}) {
  const stripe = useStripe() // Stripe instance
  const elements = useElements() // Collection of items
  const [isCreatingHolder, setIsCreatingHolder] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)

  const t = useTranslations()

  const { refreshPaymentHolders } = usePayments()

  const setPaymentAttachCard = async (
    user_id: string,
    payment_method_id: string
  ) => {
    setIsCreatingHolder(true)

    try {
      const result = await paymentAttachCard({
        user_id: user_id,
        payment_method_id: payment_method_id,
      })

      await refreshPaymentHolders()

      onPaymentCreated(true)
    } catch (error) {
      console.error("Error while saving the card:", error)
    } finally {
      setIsCreatingHolder(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setError(null)
    setLoading(true)

    if (!stripe || !elements) {
      setError("Stripe is not ready.")
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setError("Card element is missing.")
      return
    }

    try {
      const { error, setupIntent } = await stripe.confirmCardSetup(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: "John Doe",
              address: {
                city: "New York",
                country: "US",
                line1: "123 Main St",
                line2: "Apt 4B",
                postal_code: "10001",
                state: "NY",
              },
              email: "john.doe@example.com",
              phone: "1234567890",
            },
          },
        }
      )

      if (error) {
        console.error("Stripe error:", error)
        setError(
          error.message || "An error occurred while confirming the card."
        )
        return
      }

      if (setupIntent?.payment_method) {
        await setPaymentAttachCard(
          user_id,
          setupIntent?.payment_method as string
        )
      } else {
        setError("Failed to retrieve payment_method from the SetupIntent.")
      }
    } catch (err) {
      console.error("General error:", err)
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Heading gendre="t6" className="text-grey-60 mb-2">
        {t("EnterCardDetails")}
      </Heading>

      <StripeCardElementWrapper
        setCardBrand={setCardBrand}
        setError={setError}
        setCardComplete={setCardComplete}
      />

      {cardComplete && (
        <Button
          type="submit"
          variant="primary"
          isLoading={loading}
          className="mt-4"
        >
          {t("SaveCard")}
        </Button>
      )}
      {error && <div className="text-red-500">{error}</div>}
    </form>
  )
}
