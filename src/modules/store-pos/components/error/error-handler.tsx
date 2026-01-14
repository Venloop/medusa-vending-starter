"use client"

import React from "react"
import { Heading, Button, StatusBadge } from "@medusajs/ui"
import StripePaymentWrapper from "../../../payments/components/stripe-payment-wrapper"
import { Confirm3DSButton } from "../../../payments/components/Confirm3DSButton"
import Payment3DS from "./payment-3ds"
import { useTranslations } from "next-intl"

interface PosSessionData {
  status: "active" | "error" | "closed"
  session_id: string
  created_at: number
  device_id: string
  last_error?: {
    timestamp: number
    message: string
    source: string
    code: number
    details: Record<string, any>
  }
  cart_id: string
  user_id: string
  code?: number
  updated_at: number
}

interface PosErrorInfo {
  title: string
  description: string
  icon: string
}

interface PosErrorHandlerProps {
  sessionData: PosSessionData | { [key: string]: any } | null
  deviceId: string
  onRetryAuthorizePayment?: () => void
  onClose?: () => void
  onCloseVenloop?: () => void
  onCloseVenloopComplete?: () => void
}

const ErrorHandler: React.FC<PosErrorHandlerProps> = ({
  sessionData,
  deviceId,
  onRetryAuthorizePayment,
}) => {
  const t = useTranslations("StorePos")

  // Check if sessionData contains an error
  if (!sessionData?.status || sessionData.status !== "error") {
    return null
  }

  const error = sessionData.last_error
  const errorCode = sessionData.code || 0
  const sessionDeviceId = sessionData.device_id || deviceId

  const getDeclineCodeMessage = (declineCode: string): any => {
    switch (declineCode) {
      case "insufficient_funds":
        return t("cardDeclinedInsufficientFunds")
      case "lost_card":
        return t("cardDeclinedLost")
      case "stolen_card":
        return t("cardDeclinedStolen")
      case "expired_card":
        return t("cardDeclinedExpired")
      case "invalid_cvc":
        return t("cardDeclinedInvalidCvc")
      default:
        return t("cardDeclinedDefault")
    }
  }

  const getPaymentError = (error: any): any => {
    if (error?.details?.status === "payment_requires_more_error") {
      return {
        title: t("paymentErrorTitle"),
        description: t("paymentErrorDescription"),
        icon: "💳",
      }
    } else if (error?.details?.status === "card_declined") {
      return {
        title: t("cardDeclinedTitle"),
        description: getDeclineCodeMessage(error?.details?.decline_code),
        icon: "💳",
      }
    }
  }

  // Map error code to error message
  const getErrorMessage = (code: number, message: string): PosErrorInfo => {
    switch (code) {
      case 420:
        return getPaymentError(error)
      case 401:
        return {
          title: t('error401Title'),
          description: t('error401Description'),
          icon: "🔐",
        }
      case 403:
        return {
          title: t('error403Title'),
          description: t('error403Description'),
          icon: "🕒",
        }
      case 405:
        return {
          title: t('error405Title'),
          description: t('error405Description'),
          icon: "🔒",
        }
      case 404:
        return {
          title: t('error404Title'),
          description: t('error404Description'),
          icon: "🔍",
        }
      case 500:
        return {
          title: t('error500Title'),
          description: t('error500Description'),
          icon: "⚠️",
        }
      default:
        return {
          title: t('errorDefaultTitle'),
          description: message || t('errorDefaultDescription'),
          icon: "❌",
        }
    }
  }

  const errorInfo = getErrorMessage(
    errorCode,
    error?.message || t('errorDefaultDescription')
  )

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-4xl rounded-2xl bg-white px-4 py-6 shadow-xl border border-gray-200">
        <div className="mb-10 grid md:grid-cols-2 items-center gap-4">
          <Heading level="h1" className="">
            <span className="block text-gray-500 text-base">{t("location")}</span>
          </Heading>
          <div className="ml-auto">
            <StatusBadge color="red">
              {sessionDeviceId
                ? t("posDeviceLabel", { deviceId: sessionDeviceId })
                : t("posDeviceDefault")}
            </StatusBadge>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="text-4xl mb-4">{errorInfo.icon}</div>
          <Heading level="h2" className="mb-3 text-lg">
            {errorInfo.title}
          </Heading>
          <p className="text-gray-600 text-sm mb-4 max-w-2xl mx-auto">
            {errorInfo.description}
          </p>
        </div>

        {errorCode === 420 && error?.details?.clientSecret && error?.details?.status === "payment_requires_more_error" && (
          <Payment3DS
            error={error}
            onRetryAuthorizePayment={onRetryAuthorizePayment}
          />
        )}
      </div>
    </div>
  )
}

export default ErrorHandler
