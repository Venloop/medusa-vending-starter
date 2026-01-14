import { deleteLineItem } from "@lib/data/cart"
import { Spinner, Trash } from "@medusajs/icons"
import { clx } from "@medusajs/ui"
import { useState } from "react"

const DeleteButton = ({
  id,
  children,
  className,
  groupItemIds,
}: {
  id: string
  children?: React.ReactNode
  className?: string
  groupItemIds?: string[]
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (id: string) => {
    setIsDeleting(true)
    if (groupItemIds && groupItemIds.length > 1) {
      // Remove all items from the group
      try {
        await Promise.all(groupItemIds.map((itemId) => deleteLineItem(itemId)))
      } catch (err) {
        setIsDeleting(false)
      }
    } else {
      await deleteLineItem(id).catch((err) => {
        setIsDeleting(false)
      })
    }
  }

  return (
    <div className={clx("flex items-center justify-between", className)}>
      <button
        className="flex gap-x-2 items-center text-ui-fg-base hover:text-ui-fg-subtle cursor-pointer font-jost font-bold text-base leading-none"
        onClick={() => handleDelete(id)}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Spinner className="animate-spin w-[15px] h-auto flex-shrink-0" />
        ) : (
          <Trash width={15} height={16} className="flex-shrink-0" />
        )}
        <span>{children}</span>
      </button>
    </div>
  )
}

export default DeleteButton
