"use client"

import { Button } from "@modules/common/components/button"
import Link from "next/link"
import IconArrow2Left from "@modules/common/icons/arrow-2-left"
import { useTranslations } from "next-intl"

interface Props {
  url?: string
  label?: string
}

const ReturnButton = ({ url, label }: Props) => {
  const t = useTranslations("Common")

  return (
    <Button variant="outline" asChild>
      <Link href={url || "/"}>
        <IconArrow2Left className="w-4 h-4" />
        {label || t("returnToHomepage")}
      </Link>
    </Button>
  )
}

export default ReturnButton
