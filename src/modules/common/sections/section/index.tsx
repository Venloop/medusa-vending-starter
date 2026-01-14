import { cva, type VariantProps } from "cva"
import { clx } from "@medusajs/ui"

const sectionVariants = cva({
  base: clx(
    "section-container"
  ),
  variants: {
    spacingTop: {
      default: "pt-4",
      alt: "pt-4 small:pt-12 md:pt-8",
      primary: "pt-8 small:pt-24 md:pt-12",
    },
    spacingBottom: {
      default: "pb-4",
      alt: "pb-4 small:pb-12 md:pb-8",
      primary: "pb-8 small:pb-24 md:pb-12",
    }
  },
  defaultVariants: {
    spacingTop: "default",
    spacingBottom: "default",
  },
})

interface SectionProps
  extends React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof sectionVariants> {
  children: React.ReactNode
}

const Section = ({ children, className, spacingTop, spacingBottom, ...props }: SectionProps) => {
  return (
    <div 
      className={clx(sectionVariants({ spacingTop, spacingBottom }), className)}
      {...props}
    >
      <div className="content-container">
        {children}
      </div>
    </div>
  )
}

export default Section
export { sectionVariants }
