"use client"

import { useTranslations } from "next-intl"
import { usePos } from "@lib/hooks/use-pos-flow"
import StepStart from "./step-start"
import StepCart from "./step-cart"
import Thanks from "@modules/store-pos/components/thanks"
import ErrorHandler from "@modules/store-pos/components/error/error-handler"
import React, { useEffect, useMemo } from "react"

export const Steps = React.memo(function Steps({
  region,
  location,
  mode,
  type,
  onStepChange,
  debug,
  countryCode,
}: {
  region: any
  location: any
  mode: string
  type: string
  onStepChange?: (step: string) => void
  debug: boolean | null
  countryCode: string
}) {
  const t = useTranslations("StorePos")

  const {
    open,
    isOpenLoading,
    retryOpen,
    step,
    setStep,
    sessionData,
    device_id,
    closeComplete,
    products,
    summary,
    summaryFinished,
    sessionPhase,
  } = usePos({
    location,
    region,
    mode,
    type,
    countryCode,
  })

  const summaryFinishedList = useMemo(
    () => [
      {
        title: t("productCount"),
        value: summaryFinished.count,
      },
      {
        title: t("toPay"),
        value: summaryFinished.total,
        currency: summaryFinished.currency,
      },
    ],
    [summaryFinished, t]
  )

  useEffect(() => {
    onStepChange?.(step)
  }, [step, onStepChange])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [step])

  const CloseVenloopCompleteButton = () => (
    <div className="">
      <button
        onClick={closeComplete}
        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-colors"
      >
        {t("closeVenloopComplete")}
      </button>
    </div>
  )

  const RetryOpenShopButton = () => (
    <div className="">
      <button
        onClick={retryOpen}
        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-colors"
      >
        {t("retryOpenShopError")}
      </button>
    </div>
  )

  return (
    <>
      {step === "start" && (
        <>
          <StepStart
            location={location}
            onConfirm={open}
            isOpenShopLoading={isOpenLoading}
          />
        </>
      )}

      {step === "products" && (
        <>
          {/* Check whether sessionData contains an error */}
          {sessionData?.status === "error" ? (
            <ErrorHandler
              sessionData={sessionData}
              deviceId={device_id}
              onRetryAuthorizePayment={retryOpen}
              onClose={() => {
                console.log("🔄 Closing after error")
                setStep("start")
              }}
              onCloseVenloopComplete={closeComplete}
            />
          ) : (
            <>
              {debug && <CloseVenloopCompleteButton />}
              {debug && <RetryOpenShopButton />}
              <StepCart
                products={products as any}
                summary={summary}
                sessionPhase={sessionPhase}
              />
            </>
          )}
        </>
      )}

      {step === "thank-you" && (
        <Thanks
          items={summaryFinishedList}
          title={t("goodChoice")}
          buttonText={t("returnToHomepage")}
          buttonTextConfirm={t("closeSummary")}
          location={location}
        />
      )}
    </>
  )
})
