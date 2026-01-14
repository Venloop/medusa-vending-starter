import { Radio as RadioGroupOption } from "@headlessui/react"
import { Text, clx, Button } from "@medusajs/ui"
import React, { useContext, useMemo, type JSX } from "react"
import { useTranslations } from "next-intl"
import Radio from "@modules/common/components/radio"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"

import { isManual } from "@lib/constants"
import SkeletonCardDetails from "@modules/skeletons/components/skeleton-card-details"
import { CardElement } from "@stripe/react-stripe-js"
import { StripeCardElementOptions } from "@stripe/stripe-js"
import PaymentTest from "../payment-test"
import { StripeContext } from "../payment-wrapper/stripe-wrapper"

import { useEffect, useState } from "react"
import { useAbortableEffect } from "@lib/hooks/useAbortableEffect"
import { HttpTypes } from "@medusajs/types"
import { SavedPaymentMethod, getSavedPaymentMethods } from "@lib/data/payment"
import { initiatePaymentSession } from "../../../../lib/data/cart"
import { capitalize } from "lodash"

type PaymentContainerProps = {
  paymentProviderId: string
  selectedPaymentOptionId: string | null
  disabled?: boolean
  paymentInfoMap: Record<string, { titleKey: string; icon: JSX.Element }>
  children?: React.ReactNode
  paymentSession?: HttpTypes.StorePaymentSession
  cart: HttpTypes.StoreCart
}

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  children,
}) => {
  const isDevelopment = process.env.NODE_ENV === "development"
  const t = useTranslations("Order")

  return (
    <RadioGroupOption
      key={paymentProviderId}
      value={paymentProviderId}
      disabled={disabled}
      className={clx(
        "flex flex-col gap-y-2 text-small-regular cursor-pointer py-4 border rounded-rounded px-8 mb-2 hover:shadow-[0_0_0_4px_rgba(17,24,39,0.1)]",
        {
          "border-2 border-gray-900":
            selectedPaymentOptionId === paymentProviderId,
        }
      )}
    >
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-x-4">
          <Radio checked={selectedPaymentOptionId === paymentProviderId} />
          <Text className="text-base-regular">
            {paymentInfoMap[paymentProviderId]?.titleKey
              ? t(paymentInfoMap[paymentProviderId].titleKey)
              : paymentProviderId}
          </Text>
          {/* {isManual(paymentProviderId) && isDevelopment && (
            <PaymentTest className="hidden small:block" />
          )} */}
        </div>
        <span className="justify-self-end text-ui-fg-base">
          {paymentInfoMap[paymentProviderId]?.icon}
        </span>
      </div>
      {isManual(paymentProviderId) && isDevelopment && (
        <PaymentTest className="small:hidden text-[10px]" />
      )}
      {children}
    </RadioGroupOption>
  )
}

export default PaymentContainer

export const StripeCardContainer = ({
  paymentProviderId,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
  paymentSession,
  cart,
  setCardBrand,
  setError,
  setCardComplete,
}: Omit<PaymentContainerProps, "children"> & {
  setCardBrand: (brand: string) => void
  setError: (error: string | null) => void
  setCardComplete: (complete: boolean) => void
}) => {
  const stripeReady = useContext(StripeContext)
  const [isLoading, setIsLoading] = useState(true)
  const [savedPaymentMethods, setSavedPaymentMethods] = useState<
    SavedPaymentMethod[]
  >([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | undefined
  >(paymentSession?.data?.payment_method_id as string | undefined)

  const hasSavedPaymentMethods = savedPaymentMethods.length > 0

  useAbortableEffect(
    ({ isAborted }) => {
      const accountHolderId = (
        paymentSession?.context?.account_holder as Record<string, string>
      )?.id

      if (!accountHolderId) {
        setIsLoading(false)
        return
      }

      const loadSavedPaymentMethods = async () => {
        try {
          const { payment_methods } = await getSavedPaymentMethods(
            accountHolderId
          )
          if (isAborted()) return

          setSavedPaymentMethods(payment_methods)
        } catch (error) {
          if (isAborted()) return
          console.error("Error loading saved payment methods:", error)
          setSavedPaymentMethods([])
        } finally {
          setIsLoading(false)
        }
      }

      loadSavedPaymentMethods()
    },
    [paymentSession]
  )

  const handleSelectPaymentMethod = async (method: SavedPaymentMethod) => {
    await initiatePaymentSession(cart, {
      provider_id: method.provider_id,
      data: {
        payment_method_id: method.id,
      },
    }).catch((error) => {
      setError(error.message)
    })

    setSelectedPaymentMethod(method.id)
  }

  return (
    <PaymentContainer
      paymentProviderId={paymentProviderId}
      selectedPaymentOptionId={selectedPaymentOptionId}
      paymentInfoMap={paymentInfoMap}
      disabled={disabled}
      paymentSession={paymentSession}
      cart={cart}
    >
      {selectedPaymentOptionId === paymentProviderId &&
        (stripeReady ? (
          <div className="my-4 transition-all duration-150 ease-in-out">
            {isLoading ? (
              <SkeletonCardDetails />
            ) : hasSavedPaymentMethods ? (
              <SavedCardsList
                savedPaymentMethods={savedPaymentMethods}
                selectedPaymentMethod={selectedPaymentMethod}
                onSelectMethod={handleSelectPaymentMethod}
                setCardComplete={setCardComplete}
                setCardBrand={setCardBrand}
                setError={setError}
              />
            ) : (
              <StripeNewCardInput
                setCardBrand={setCardBrand}
                setError={setError}
                setCardComplete={setCardComplete}
              />
            )}
          </div>
        ) : (
          <SkeletonCardDetails />
        ))}
    </PaymentContainer>
  )
}

const StripeNewCardInput = ({
  setCardBrand,
  setError,
  setCardComplete,
}: {
  setCardBrand: (brand: string) => void
  setError: (error: string | null) => void
  setCardComplete: (complete: boolean) => void
}) => {
  const t = useTranslations("Checkout")

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
    <>
      <Text className="txt-medium-plus text-ui-fg-base my-1">
        {t("enterYourCardDetails")}
      </Text>

      <CardElement
        options={useOptions as StripeCardElementOptions}
        onChange={(e) => {
          setCardBrand(
            e.brand && e.brand.charAt(0).toUpperCase() + e.brand.slice(1)
          )
          setError(e.error?.message || null)
          setCardComplete(e.complete)
        }}
      />
      <div className="flex items-start gap-3">
        <Text className="text-xs text-ui-fg-subtle my-2">
          {t("stripeSecurityInfo")}
        </Text>
      </div>
    </>
  )
}

const SavedCardsList = ({
  savedPaymentMethods,
  selectedPaymentMethod,
  onSelectMethod,
  setCardComplete,
  setCardBrand,
  setError,
}: {
  savedPaymentMethods: SavedPaymentMethod[]
  selectedPaymentMethod: string | undefined
  onSelectMethod: (method: SavedPaymentMethod) => Promise<void>
  setCardComplete: (complete: boolean) => void
  setCardBrand: (brand: string) => void
  setError: (error: string | null) => void
}) => {
  const t = useTranslations("Checkout")
  const [isChangingMethod, setIsChangingMethod] = useState(false)

  useEffect(() => {
    if (!selectedPaymentMethod || !savedPaymentMethods.length) {
      setCardComplete(false)
      setCardBrand("")
      setError(null)
      return
    }

    const selectedMethod = savedPaymentMethods.find(
      (method) => method.id === selectedPaymentMethod
    )

    if (!selectedMethod) {
      return
    }

    setCardBrand(capitalize(selectedMethod.data.card.brand))
    setCardComplete(true)
    setError(null)
  }, [
    selectedPaymentMethod,
    savedPaymentMethods,
    setCardBrand,
    setCardComplete,
    setError,
  ])

  const handleMethodClick = async (method: SavedPaymentMethod) => {
    setIsChangingMethod(true)
    try {
      await onSelectMethod(method)
    } finally {
      setIsChangingMethod(false)
    }
  }

  return (
    <div className="relative flex flex-col gap-y-2">
      {isChangingMethod && (
        <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center rounded-lg">
          <Spinner size="32" />
        </div>
      )}
      <Text className="txt-medium-plus text-ui-fg-base">
        {t("chooseSavedPaymentMethod")}
      </Text>
      {savedPaymentMethods.map((method) => (
        <div
          key={method.id}
          className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:border-gray-900 hover:hover:shadow-[0_0_0_4px_rgba(17,24,39,0.1)] ${
            selectedPaymentMethod === method.id ? "border-gray-900" : ""
          }`}
          role="button"
          onClick={() => handleMethodClick(method)}
        >
          <div className="flex items-center gap-x-4">
            <input
              type="radio"
              name="saved-payment-method"
              value={method.id}
              checked={selectedPaymentMethod === method.id}
              className="sr-only"
              onChange={(e) => {
                if (e.target.checked) {
                  handleMethodClick(method)
                }
              }}
            />
            <Radio checked={selectedPaymentMethod === method.id} />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-ui-fg-base">
                {capitalize(method.data.card.brand)} ••••{" "}
                {method.data.card.last4}
              </span>
              <span className="text-xs text-ui-fg-subtle">
                {t("expires")} {method.data.card.exp_month}/
                {method.data.card.exp_year}
              </span>
            </div>
          </div>
        </div>
      ))}
      <LocalizedClientLink href="/account/cards">
        <Button variant="secondary" className="mt-4 h-10">
          {t("managePaymentMethods")}
        </Button>
      </LocalizedClientLink>
    </div>
  )
}
