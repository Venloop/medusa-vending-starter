"use client"

import IconLocation from "@modules/common/icons/location"
import { useTranslations } from "next-intl"

const LocationName = ({ location, className }: { location: any, className?: string }) => {
  const t = useTranslations("StorePos")

  return (
    <div className={className}>
      <div className="inline-flex items-center gap-2 text-base bg-yellow-50 p-2 rounded-lg">
        <IconLocation className="w-4 h-4" />
        <span>{t("selectedLocation")} <strong>{location?.name}</strong></span>
      </div>
    </div>
  )
}

export default LocationName