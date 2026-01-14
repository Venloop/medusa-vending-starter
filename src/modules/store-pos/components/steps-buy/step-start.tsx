'use client'

import { useTranslations } from "next-intl"
import LocationTrigger from "@modules/store-pos/components/location-trigger"

interface StepStartProps {
  location: any
  onConfirm: () => void
  isOpenShopLoading: boolean
}

export default function StepStart({ location, onConfirm, isOpenShopLoading }: StepStartProps) {
  const t = useTranslations("StorePos")
  
  return (
    <LocationTrigger title={t("confirmOpenVenloop")} location={location} onConfirm={onConfirm} isLoading={isOpenShopLoading} />
  )
}
