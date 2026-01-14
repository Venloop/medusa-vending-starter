"use client"

import { useTranslations } from "next-intl"
import IcoOk from "@modules/common/icons/ok"

const DeviceAvailable = () => {
  const t = useTranslations("StorePos")
  
  return (
    
    <div>
      <div className="flex items-center gap-2">
        <IcoOk className="w-6 h-6 fill-green-600" />
        <span>{t("boxIsClosed")}</span>
      </div>  
    </div>
  )
}

export default DeviceAvailable