import { cva, type VariantProps } from "cva"
import * as React from "react"

import { clx } from "@medusajs/ui"

const headingVariants = cva({
  base: "font-jost font-bold",
  variants: {
    level: {
      h1: "h1-core",
      h2: "h2-core",
      h3: "h3-core",
    },
    gendre: {
      t1: "md:text-4xl small:text-5xl text-2xl font-bold",
      t2: "md:text-2xl small:text-3xl text-2xl font-bold",
      t3: "md:text-xl small:text-2xl text-xl font-bold",
      t4: "md:text-lg small:text-xl text-xl font-bold",
      t5: "md:text-sm small:text-2 text-xl font-bold",
      t6: "md:text-base small:text-base text-base font-bold",
      t7: "text-lg font-bold",
    }
  },
  defaultVariants: {
    level: "h1",
    gendre: "t2",
  },
})

interface HeadingProps extends VariantProps<typeof headingVariants>,
  React.HTMLAttributes<HTMLHeadingElement> {}

/**
 * This component is based on the heading element (`h1`, `h2`, etc...) depeneding on the specified level
 * and supports all of its props
 */
const Heading = ({ 
  /**
   * The heading level which specifies which heading element is used.
   */
  level = "h1", 
  gendre = "t2",
  className, 
  ...props
}: HeadingProps) => {
  const Component = level || "h1"

  return (
    <Component
      className={clx(headingVariants({ level, gendre }), className)}
      {...props}
    />
  )
}

export { Heading, headingVariants }
