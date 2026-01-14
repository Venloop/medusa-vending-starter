import { cva, type VariantProps } from "cva"
import * as React from "react"

import { clx } from "@medusajs/ui"

const contentVariants = cva({
  base: `
    font-normal text-base
    [&>p]:mb-4 [&>p:last-child]:mb-0 [&>p]:leading-relaxed
    [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:leading-snug [&_h2]:md:mt-8 [&_h2]:md:mb-4 [&_h2]:md:text-2xl
    [&_h3]:mt-4 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:leading-snug [&_h3]:md:mt-6 [&_h3]:md:mb-3 [&_h3]:md:text-xl
    [&_ul]:list-none [&_ul]:pl-0 [&_ul]:space-y-2
    [&_ul_li]:relative [&_ul_li]:pl-6 [&_ul_li]:md:pl-8
    [&_ul_li]:before:content-[''] [&_ul_li]:before:absolute
    [&_ul_li]:before:left-1.5 [&_ul_li]:before:top-2
    [&_ul_li]:before:w-[0.9375rem] [&_ul_li]:before:h-[0.600rem]
    [&_ul_li]:before:bg-check [&_ul_li]:before:bg-no-repeat [&_ul_li]:before:bg-center [&_ul_li]:before:bg-cover
    [&_ol]:list-none [&_ol]:pl-0 [&_ol]:space-y-2
    [&_ol_li]:relative [&_ol_li]:pl-6 [&_ol_li]:md:pl-8
    [&_ol_li]:before:content-[''] [&_ol_li]:before:absolute
    [&_ol_li]:before:left-1.5 [&_ol_li]:before:top-2
    [&_ol_li]:before:w-[0.9375rem] [&_ol_li]:before:h-[0.600rem]
    [&_ol_li]:before:bg-check [&_ol_li]:before:bg-no-repeat [&_ol_li]:before:bg-center [&_ol_li]:before:bg-cover
    [&_li>ul]:mt-1.5 [&_li>ul]:md:mt-2 [&_li>ol]:mt-1.5 [&_li>ol]:md:mt-2
    
    /* Tables */
    [&_table]:w-full [&_table]:table-auto [&_table]:border-collapse [&_table]:my-4
    [&_th]:text-left [&_th]:font-semibold
    [&_th]:border [&_th]:border-gray-200 [&_th]:px-3 [&_th]:py-2
    [&_td]:border [&_td]:border-gray-200 [&_td]:px-3 [&_td]:py-2
    [&_thead_th]:bg-gray-50
    [&_tbody_tr:nth-child(even)]:bg-gray-50
  `,
  variants: {
    tag: {
      div: "p-core",
    },
  },
  defaultVariants: {
    tag: "div",
  },
})

interface ContentProps extends VariantProps<typeof contentVariants>,
  React.HTMLAttributes<HTMLDivElement> {}

/**
 * This component is based on the content element (`h1`, `h2`, etc...) depeneding on the specified level
 * and supports all of its props
 */
const Content = ({ 
  /**
   * The content level which specifies which content element is used.
   */
  tag = "div", 
  className, 
  ...props
}: ContentProps) => {
  const Component = tag || "div"

  return (
    <Component
      className={clx(contentVariants({ tag }), className)}
      {...props}
    />
  )
}

export { Content, contentVariants }
