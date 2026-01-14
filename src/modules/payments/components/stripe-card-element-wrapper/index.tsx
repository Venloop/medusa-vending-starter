"use client"

import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { StripeCardElementOptions } from "@stripe/stripe-js"

import React, { useContext, useMemo, type JSX, useState, useEffect } from "react"

type StripeCardElementWrapperProps = {
  onReady?: (event: any) => void
  onFocus?: (event: any) => void
  onBlur?: (event: any) => void
  onEscape?: (event: any) => void
  className?: string
  setCardBrand: (brand: string) => void
  setError: (error: string | null) => void
  setCardComplete: (complete: boolean) => void
}

const StripeCardElementWrapper: React.FC<StripeCardElementWrapperProps> = ({
  onReady,
  onFocus,
  onBlur,
  onEscape,
  className,
  setCardBrand,
  setError,
  setCardComplete,
}) => {
  const stripe = useStripe()
  const elements = useElements()

  if (!stripe || !elements) {
    return (
      <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
        <p className="text-gray-500">Ładowanie Stripe...</p>
      </div>
    )
  }

  const useOptions: StripeCardElementOptions = useMemo(() => {
    return {
      style: {
        base: {
          fontFamily: "Inter, sans-serif",
          color: "#424270",
          "::placeholder": {
            color: "rgb(107 114 128)",
          },
        },
      },
      classes: {
        base: "pt-3 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover transition-all duration-300 ease-in-out",
      },
    }
  }, [])

  return (
    <CardElement
      options={useOptions}
      onChange={(e) => {
        setCardBrand(
          e.brand && e.brand.charAt(0).toUpperCase() + e.brand.slice(1)
        )
        setError(e.error?.message || null)
        setCardComplete(e.complete)
      }}
      onReady={onReady}
      onFocus={onFocus}
      onBlur={onBlur}
      className={className}
    />
  )
}

export default StripeCardElementWrapper 