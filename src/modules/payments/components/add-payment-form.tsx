"use client"

import { Text } from "@medusajs/ui"
import { Heading } from "@modules/common/components/heading"
import { Button } from "@modules/common/components/button"
import Plus from "@modules/common/icons/plus"

import { useCustomer } from "@lib/providers/customer"
import { usePayments } from "@lib/providers/payments"
import { paymentSetupIntent, paymentCreateHolder } from "@lib/data/pos"

import StripePaymentWrapper from "@modules/payments/components/stripe-payment-wrapper"
import StripeCardAddForm from "@modules/payments/components/stripe-card-add-form"

import React, { useState, useEffect } from "react"
import { useTranslations } from "next-intl"

const AddPaymentForm: React.FC<{ description?: React.ReactNode }> = ({
  description,
}) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isCreatingHolder, setIsCreatingHolder] = useState(false)
  const [isLoadingClientSecret, setIsLoadingClientSecret] = useState(false)
  const [paymentCreated, setPaymentCreated] = useState(false)
  const { customer } = useCustomer()
  const { paymentHolders, isLoadingPaymenHolders } = usePayments()

  // Get client secret
  const fetchClientSecret = async () => {
    const { result } = await paymentSetupIntent({
      user_id: customer?.id as string,
    })
    setClientSecret(result.intent.client_secret)
    setIsLoadingClientSecret(false)
  }

  // Handle add card
  const handleAddCard = async () => {
    setIsLoadingClientSecret(true)

    if (paymentHolders && paymentHolders.length > 0) {
      await fetchClientSecret()
    } else {
      await handleCreateHolder()
      await fetchClientSecret()
    }
  }

  // Handle create holder
  const handleCreateHolder = async () => {
    setIsCreatingHolder(true)

    try {
      await paymentCreateHolder({ user_id: customer?.id as string })
    } catch (error) {
      console.error("Error creating holder:", error)
    } finally {
      setIsCreatingHolder(false)
    }
  }

  const totalCards =
    paymentHolders?.reduce(
      (acc, holder) => acc + holder.payment_methods.length,
      0
    ) || 0
  const canAddCard = totalCards < 1

  useEffect(() => {
    if (paymentCreated) {
      setClientSecret(null)
      setPaymentCreated(false)
    }
  }, [paymentCreated])

  const t = useTranslations("Payments")

  return (
    <div className="mb-8 last:mb-0">
      <div className="mb-4">
        <Heading gendre="t4" className="text-grey-60 mb-4">
          {t("addPaymentCard")}
        </Heading>
        <div className="flex items-start gap-3">
          <Text className="text-xs text-ui-fg-subtle">
            {t("stripeSecurityInfo")}
          </Text>
        </div>
        {description && <Text>{description}</Text>}
      </div>

      {!clientSecret && (
        <div className="flex flex-col gap-4">
          <Button
            onClick={handleAddCard}
            disabled={!canAddCard || isCreatingHolder}
            isLoading={isLoadingClientSecret}
            variant="outline"
            size="base"
          >
            <Plus className="w-6 h-6" />
            {t("addNewCard")}
          </Button>
          {!canAddCard && (
            <Text className="text-sm text-ui-fg-subtle">
              {t("maxCardsReached")}
            </Text>
          )}
        </div>
      )}

      {paymentCreated && (
        <p className="text-base text-grey-60">{t("cardAdded")}</p>
      )}

      {clientSecret && (
        <StripePaymentWrapper clientSecret={clientSecret}>
          <StripeCardAddForm
            clientSecret={clientSecret}
            user_id={customer?.id as string}
            onPaymentCreated={setPaymentCreated}
          />
        </StripePaymentWrapper>
      )}
    </div>
  )
}

export default AddPaymentForm
