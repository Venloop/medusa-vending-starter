"use client"

import React from "react"
import StripePaymentWrapper from "../../../../payments/components/stripe-payment-wrapper"
import { Confirm3DSButton } from "../../../../payments/components/Confirm3DSButton"

interface Payment3DSProps {
  error: any
  onRetryAuthorizePayment?: () => void
}

const Payment3DS: React.FC<Payment3DSProps> = ({
  error,
  onRetryAuthorizePayment,
}) => {
  return (
    <>
      <div className="sticky bottom-0 mt-4 w-full rounded-md border bg-gray-50 p-4">
        {error?.details?.clientSecret && (
          <StripePaymentWrapper clientSecret={error?.details?.clientSecret}>
            <Confirm3DSButton
              clientSecret={error.details.clientSecret}
              onSuccess={async (pi) => {
                onRetryAuthorizePayment?.()
              }}
              onAbort={(err) => {
                onRetryAuthorizePayment?.()
              }}
            />
          </StripePaymentWrapper>
        )}
      </div>
    </>
  )
}

export default Payment3DS
