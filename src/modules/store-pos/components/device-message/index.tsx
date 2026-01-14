"use client"

import IcoOk from "@modules/common/icons/ok"
import { clx } from "@medusajs/ui"
import Spinner from "@modules/common/icons/spinner"

const DeviceMessage = ({
  variant,
  title,
  suffix,
  className,
  activeLoader,
}: {
  variant: "success" | "error" | "pending"
  title: string
  suffix?: string
  className: string
  activeLoader?: boolean
}) => {
  const variantStyles = {
    success: "bg-green-50 text-green-30 fill-green-30",
    error: "bg-red-50 text-red-600 fill-red-600",
    pending: "bg-orange-100 text-orange-400 fill-orange-400",
  }

  return (
    <div className={className}>
      <div
        className={clx(
          "flex items-center small:gap-4 gap-2 rounded-lg",
          variantStyles[variant],
          "rounded-lg px-4 small:px-5 py-2.5 sm:py-5"
        )}
      >
        <IcoOk className="small:w-10 small:h-10 w-8 h-8" />
        <div className="flex flex-col sm:flex-row sm:items-center small:gap-0 gap-0.5 text-base flex-1">
          <strong className="small:text-lg text-base">{title}</strong>
          {suffix && <span className="small:text-xs text-xs">{suffix}</span>}
        </div>
        {activeLoader && (
          <div className="ml-auto">
            <Spinner className="animate-spin small:w-8 small:h-8 w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  )
}

export default DeviceMessage
