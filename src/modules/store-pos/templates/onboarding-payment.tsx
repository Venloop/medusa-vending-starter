'use client'

import React from 'react'
import { usePayments } from '@lib/providers/payments'
import AddPaymentForm from '@modules/payments/components/add-payment-form'
import { useTranslations } from 'next-intl'

export const OnboardingPayment = React.memo(function OnboardingPayment() {
  const { paymentMethods } = usePayments()
  const t = useTranslations('StorePos')

  return (
    <>
      <AddPaymentForm description={paymentMethods && paymentMethods.length === 0 && t('onboardingPaymentDescription')} />
    </>
  )
})
