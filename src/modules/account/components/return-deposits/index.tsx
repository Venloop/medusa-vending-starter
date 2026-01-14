"use client"

import { useTranslations } from "next-intl"
import { Heading } from "@modules/common/components/heading"

const ReturnDepositOverview = ({ items, count }: { items: any, count: number }) => {
  const t = useTranslations("Account.ReturnDeposit")
  if (items?.length) {
    return (
      <>
        <div className="mb-8 flex flex-col gap-y-4">
          <Heading gendre="t3" className="text-grey-60 mb-4">{t("countLabel", { count })}</Heading>
        </div>
      </>
    )
  }

  return (
    <div
      className="w-full flex flex-col items-center gap-y-4"
      data-testid="no-orders-container"
    >
      <h2 className="text-large-semi">{t("noReturns")}</h2>
    </div>
  )
}

export default ReturnDepositOverview
