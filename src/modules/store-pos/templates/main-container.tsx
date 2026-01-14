'use client'

import React, { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useCustomer } from "@lib/providers/customer"
import { usePayments } from '@lib/providers/payments'
import { OnboardingPayment } from './onboarding-payment'
import { Steps as StepsReturn } from '../components/steps-return'
import { Steps as StepsBuy } from '../components/steps-buy'

export const MainContainer = React.memo(function MainContainer({ onStepChange, region, location, mode, type, debug, countryCode }: { onStepChange: (step: string) => void, region: any, location: any, mode: string, type: string, debug: boolean, countryCode: string }) {
  const { customer, isLoading: customerLoading } = useCustomer()
  const { paymentMethods, isLoadingPaymenHolders } = usePayments()
  const t = useTranslations('StorePos')

  // Do not show the loader if we already have payment methods (meaning we are in the Steps)
  const shouldShowLoader = customerLoading || (customer?.id && isLoadingPaymenHolders && paymentMethods.length === 0)

  // Loader component
  const Loader = () => (
    <div className="text-center mt-10 mb-11">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('loading')}</h2>
      <p className="text-gray-600 text-sm">
        {customerLoading ? t('loadingCustomer') : t('loadingPaymentMethods')}
      </p>
    </div>
  )

  // Show the loader while loading data such as the customer and payment methods
  if (shouldShowLoader) {
    return <Loader />
  }

  return (
    <>
      {customer?.id ? (
        <>
          {paymentMethods.length === 0 && <OnboardingPayment />}
          {paymentMethods.length > 0 && type === "return" && <StepsReturn region={region} location={location} mode={mode} type={type} debug={debug} onStepChange={onStepChange} countryCode={countryCode} />}
          {paymentMethods.length > 0 && type === "buy" && <StepsBuy region={region} location={location} mode={mode} type={type} debug={debug} onStepChange={onStepChange} countryCode={countryCode} />}
        </>
      ) : (
        <div className="py-10 px-4">
          <OnboardingPayment />
        </div>
      )}
    </>
  )
})
