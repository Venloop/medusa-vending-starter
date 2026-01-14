'use client'

import { useTranslations } from "next-intl"
import DeviceMessage from "@modules/store-pos/components/device-message"
import { Heading } from "@modules/common/components/heading"
import { Content } from "@modules/common/components/content"
import VariantPreviewPos from "@modules/products/components/variant-preview-pos"
import VariantDepositPreviewPos from "@modules/products/components/variant-deposit-preview-pos"

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
    total: number
    currency: string
  }
  sessionPhase: "shopping" | "closing" | "finalizing" | null
}

export default function StepCart({
  products,
  summary,
  sessionPhase
}: StepCartProps) {
  const t = useTranslations("StorePos")

  const getDeviceMessageProps = () => {
    switch (sessionPhase) {
      case "shopping":
        return {
          variant: "success" as const,
          title: t("venloopIsOpen"),
          suffix: t("preauthorizationNotice"),
          activeLoader: false,
        }
      case "closing":
        return {
          variant: "pending" as const,
          title: t("processingOrder"),
          suffix: undefined,
          activeLoader: true,
        }
      case "finalizing":
        return {
          variant: "pending" as const,
          title: t("finalizingProcess"),
          suffix: undefined,
          activeLoader: true,
        }
      default:
        return {
          variant: "success" as const,
          title: t("venloopIsOpen"),
          suffix: t("preauthorizationNotice"),
          activeLoader: false,
        }
    }
  }

  const messageProps = getDeviceMessageProps()

  return (
    <div className="min-h-[calc(100vh-280px)] small:min-h-0">
      <DeviceMessage 
        variant={messageProps.variant} 
        title={messageProps.title} 
        suffix={messageProps.suffix} 
        className="md:mb-8 mb-4"
        activeLoader={messageProps.activeLoader}
      />
      
      <div className="grid md:grid-cols-[1fr_30%]">
        <div>
          <Heading level="h2" gendre="t3" className="md:mb-8 mb-4">{t("yourProducts")}</Heading>

          {products.length === 0 && 
          <div>
            <Content>
              {t("canSelectProducts")}
            </Content>
          </div>}

          {products.length > 0 && <div>
            <ul
              className="grid grid-cols-1 gap-4 w-full sm:grid-cols-2 md:grid-cols-3 md:gap-12 items-stretch"
            >
              {products.map((p: any) => {
                return (
                  <li key={p.id}>
                    {p.product_type == "Deposit" ? (
                      <VariantDepositPreviewPos variant={p.variant} product={p.product} item={p} />
                    ) : (
                      <VariantPreviewPos variant={p.variant} product={p.product} item={p} />
                    )}
                  </li>
                )
              })}
            </ul>
          </div>}
        </div>
        <div>
          {<div>
              <div className="rounded-md md:bg-yellow-50 bg-white md:p-6 p-4 fixed bottom-0 left-0 right-0 w-full md:relative">
                <Heading level="h3" gendre="t4" className="md:mb-8 mb-4">{t("summary")}</Heading>
                <dl className="grid grid-cols-2 md:gap-2 gap-1">
                  <dt className="text-sm font-medium">{t("productCount")}</dt>
                  <dd className="text-sm text-right font-bold">{summary.count}</dd>
                  <dt className="text-sm font-medium">{t("toPay")}</dt>
                  <dd className="text-sm text-right font-bold">{summary.total} {summary.currency}</dd>
                </dl>
              </div>
          </div>}
        </div>
      </div>
    </div>
  )
}
