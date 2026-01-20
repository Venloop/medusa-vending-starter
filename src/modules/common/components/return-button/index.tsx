"use client"

import { Button } from "@modules/common/components/button"
import IconArrow2Left from "@modules/common/icons/arrow-2-left"
import { useTranslations } from "next-intl"
import LocalizedClientLink from "../localized-client-link"

interface Props {
  url?: string
  label?: string
}

const ReturnButton = ({ url, label }: Props) => {
  const t = useTranslations("Common")

  return (
    <Button variant="outline" asChild>
      <LocalizedClientLink href={url || "/"}>
        <IconArrow2Left className="w-4 h-4" />
        {label || t("returnToHomepage")}
      </LocalizedClientLink>
    </Button>
  )
}

export default ReturnButton
