"use client"

import { loadStripe } from "@stripe/stripe-js"
import React from "react"
import StripeWrapper from "./stripe-wrapper"

type PaymentWrapperProps = {
  clientSecret: string
  children: React.ReactNode
}

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_KEY
const stripePromise = stripeKey ? loadStripe(stripeKey) : null

const StripePaymentWrapper: React.FC<PaymentWrapperProps> = ({ clientSecret, children }) => {
  if (
    clientSecret &&
    stripePromise
  ) {
    return (
      <StripeWrapper
        clientSecret={clientSecret}
        stripeKey={stripeKey}
        stripePromise={stripePromise}
      >
        {children}
      </StripeWrapper>
    )
  }

  return <div>{children}</div>
}

export default StripePaymentWrapper
