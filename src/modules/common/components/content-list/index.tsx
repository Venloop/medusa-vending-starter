import { cva, type VariantProps } from "cva"
import * as React from "react"

import { clx } from "@medusajs/ui"
import Image from "next/image"

const contentListVariants = cva({
  base: `
    font-normal text-base space-y-4
  `,
  variants: {
   
  },
  defaultVariants: {
  
  },
})

interface ContentListProps extends VariantProps<typeof contentListVariants>,
  React.HTMLAttributes<HTMLUListElement> {
  items: { title: string }[]
}

/**
 * This component is based on the content element (`h1`, `h2`, etc...) depeneding on the specified level
 * and supports all of its props
 */
const ContentList = ({ 
  /**
   * The content level which specifies which content element is used.
   */
  className, 
  items,
  ...props
}: ContentListProps) => {
  return (
    <ul
      className={clx(contentListVariants({  }), className)}
      {...props}
    >
      {items.map((item: { title: string }) => (
        <li key={item.title} className="flex items-center gap-4">
          <Image src="/images/ico-circle-1.svg" alt={item.title} className="w-12 h-12" width={48} height={48} />
          {item.title}
        </li>
      ))}
    </ul>
  )
}

export { ContentList, contentListVariants }
