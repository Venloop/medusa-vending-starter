"use client"

import { clearCart } from "@lib/data/cart"
import { Spinner, Trash } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { useState } from "react"

const ClearCartButton = ({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleClear = async () => {
    setIsDeleting(true)
    await clearCart().catch((err) => {
      setIsDeleting(false)
    })
  }

  return (
    <div
      className={clx(
        "flex items-center justify-between",
        className
      )}
    >
      <button
        className="flex gap-x-2 items-center text-ui-fg-base hover:text-ui-fg-subtle cursor-pointer font-jost font-bold text-base leading-none"
        onClick={handleClear}
        disabled={isDeleting}
      >
        {isDeleting ? <Spinner className="animate-spin w-[15px] h-auto flex-shrink-0" /> : <Trash width={15} height={16} className="flex-shrink-0" />}
        <span>{children}</span>
      </button>
    </div>
  )
}

export default ClearCartButton
