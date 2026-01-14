'use client'

import { useTranslations } from "next-intl"
import DeviceMessage from "@modules/store-pos/components/device-message"
import { Heading } from "@modules/common/components/heading"
import { Content } from "@modules/common/components/content"
import VariantDepositPreviewPos from "@modules/products/components/variant-deposit-preview-pos"
import ModalWarning from "@modules/store-pos/components/modal-warning"

interface Product {
  id: string
  name: string
  imageUrl: string
  rating: number
  price: number
  volume: string
  calories: number
  quantity: number
}

interface StepCartProps {
  products: Product[]
  summary: {
    count: number
    countUnknown: number
    countUnauthorized: number
    total: number
    leftToReturn: number
  },
  modalWarningOpened: boolean
  onModalWarningClose: (opened: boolean) => void
  sessionPhase: "shopping" | "closing" | "finalizing" | null
}

export default function StepCart({
  products,
  summary,
  modalWarningOpened,
  onModalWarningClose,
  sessionPhase
}: StepCartProps) {
  const t = useTranslations("StorePos")

  const getDeviceMessageProps = () => {
    switch (sessionPhase) {
      case "shopping":
        return {
          variant: "success" as const,
          title: t("venloopIsOpen"),
          activeLoader: false,
        }
      case "closing":
        return {
          variant: "pending" as const,
          title: t("processingOrder"),
          activeLoader: true,
        }
      case "finalizing":
        return {
          variant: "pending" as const,
          title: t("finalizingProcess"),
          activeLoader: true,
        }
      default:
        return {
          variant: "success" as const,
          title: t("venloopIsOpen"),
          activeLoader: false,
        }
    }
  }

  const messageProps = getDeviceMessageProps()

  return (
    <>
    {modalWarningOpened && <ModalWarning title={t("warningNotYourJar")} onClose={() => onModalWarningClose(false)} />}
              
    <div className="min-h-[calc(100vh-280px)] small:min-h-0">
      <DeviceMessage 
        variant={messageProps.variant} 
        title={messageProps.title} 
        className="md:mb-8 mb-4"
        activeLoader={messageProps.activeLoader}
      />
      
      <div className="grid md:grid-cols-[1fr_30%]">
        <div>
          <Heading level="h2" gendre="t3" className="md:mb-8 mb-4">{t("yourPackaging")}</Heading>

          {products.length === 0 && 
          <div>
            <Content>
              {t("canSelectProducts")}
            </Content>
          </div>}

          {products.length > 0 && <div>
            <ul
              className="grid grid-cols-3 w-full md:grid-cols-3 gap-12 items-stretch"
            >
              {products.map((p: any) => {
                return (
                  <li key={p.id}>
                    {p.type !== 'unknown' && (
                      <VariantDepositPreviewPos variant={p.product_variant} product={p.product} type={p.type} />
                    )}
                  </li>
                )
              })}
            </ul>
          </div>}
        </div>
        <div>
          <div>
              <div className="rounded-md md:bg-yellow-50 bg-yellow-50 border border-black/25 md:border-none md:p-6 p-2 py-4 fixed bottom-0 left-0 right-0 w-full md:relative">
                <Heading level="h3" gendre="t4" className="md:mb-8 mb-2">{t("summaryColon")}</Heading>
                <div className="">
                  <dl className="grid grid-cols-2 md:gap-1 gap-1 pb-1 mb-1 border-b border-grey-150">
                    <dt className="text-sm font-medium">{t("packagingCount")}</dt>
                    <dd className="text-sm text-right font-bold">{summary.count}</dd>
                  </dl>
                  {summary.count > 0 && (
                  <dl className="grid grid-cols-2 md:gap-1 gap-1 pb-1 mb-1 border-b border-grey-150">
                      <dt className="text-sm font-medium">{t("returnedYours")}</dt>
                      <dd className="text-sm text-right font-bold">{summary.count}</dd>
                  </dl>
                  )}
                  {summary.countUnknown > 0 && (
                  <dl className="grid grid-cols-2 md:gap-1 gap-1 pb-1 mb-1 border-b border-grey-150">
                      <dt className="text-sm font-medium">{t("returnedUnknown")}</dt>
                      <dd className="text-sm text-right font-bold">{summary.countUnknown}</dd>
                  </dl>
                  )}
                  {summary.countUnauthorized > 0 && (
                    <dl className="grid grid-cols-2 md:gap-1 gap-1 pb-1 mb-1 border-b border-grey-150">
                      <dt className="text-sm font-medium">{t("returnedUnauthorized")}</dt>
                      <dd className="text-sm text-right font-bold">{summary.countUnauthorized}</dd>
                  </dl>
                  )}
                  <dl className="grid grid-cols-2 md:gap-1 gap-1 pb-1 mb-1 border-b border-grey-150">
                    <dt className="text-sm font-medium">{t("depositAmount")}</dt>
                    <dd className="text-sm text-right font-bold">{summary.total.toFixed(2)} zł</dd>
                  </dl>
                  <dl className="grid grid-cols-2 md:gap-1 gap-1">
                    <dt className="text-sm font-medium">{t("leftToReturn")}</dt>
                    <dd className="text-sm text-right font-bold">{summary.leftToReturn}</dd>
                  </dl>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
