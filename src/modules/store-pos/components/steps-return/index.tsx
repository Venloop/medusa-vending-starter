"use client"

import { useTranslations } from "next-intl"
import { usePosReturnFlow } from "@lib/hooks/use-pos-return-flow"

import StepStart from "./step-start"
import StepCart from "./step-cart"
import ModalWarning from "@modules/store-pos/components/modal-warning"
import Thanks from "@modules/store-pos/components/thanks"
import ErrorHandler from "@modules/store-pos/components/error/error-handler"
import React, { useRef, useEffect, useState } from "react"

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

  const [summaryFinishedList, setSummaryFinishedList] = useState<any>([
    {
      title: t("yourPackaging"),
      value: 0,
    },
    {
      title: t("depositAmount"),
      value: 0,
      currency: "zł",
    },
    {
      title: t("leftToReturn"),
      value: 0,
    },
  ])

  const [modalWarningOpened, setModalWarningOpened] = useState(false)
  const previousCountUnauthorizedRef = useRef<number | null>(null)

  const {
    open,
    isOpenLoading,
    step,
    setStep,
    sessionData,
    device_id,
    closeComplete,
    products,
    summary,
    summaryFinished,
    sessionPhase,
  } = usePosReturnFlow({
    location,
    region,
    mode,
    type,
    countryCode,
  })

  useEffect(() => {
    onStepChange?.(step)
  }, [step])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [step])

  useEffect(() => {
    setSummaryFinishedList([
      {
        title: t("returnedPackaging"),
        value: summaryFinished.count,
      },
      {
        title: t("returnedDeposit"),
        value: summaryFinished.total,
        currency: summaryFinished.currency,
      },
      {
        title: t("leftToReturnFinished"),
        value: summaryFinished.leftToReturn,
      },
    ])
  }, [summaryFinished, t])

  useEffect(() => {
    const current = summary.countUnauthorized

    // Set previous count unauthorized on mount
    if (previousCountUnauthorizedRef.current === null) {
      previousCountUnauthorizedRef.current = current
      return
    }

    // React on any increase after initial mount
    if (current > previousCountUnauthorizedRef.current) {
      setModalWarningOpened(true)
    }

    previousCountUnauthorizedRef.current = current
  }, [summary.countUnauthorized])

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
          {sessionData?.status === "error" ? (
            <ErrorHandler
              sessionData={sessionData}
              deviceId={device_id}
              onClose={() => {
                console.log("🔄 Closing after error")
                setStep("start")
              }}
              onCloseVenloopComplete={closeComplete}
            />
          ) : (
            <>
              {debug && <CloseVenloopCompleteButton />}
              <StepCart
                products={products as any}
                summary={summary}
                modalWarningOpened={modalWarningOpened}
                onModalWarningClose={setModalWarningOpened}
                sessionPhase={sessionPhase}
              />
            </>
          )}
        </>
      )}

      {step === "thank-you" && (
        <Thanks
          items={summaryFinishedList}
          title={t("thanksForReturn")}
          description={t("packagingGotSecondLife")}
          buttonText={t("returnToHomepage")}
          buttonTextConfirm={t("closeSummary")}
          location={location}
        />
      )}
    </>
  )
})
