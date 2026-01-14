import { clx } from "@medusajs/ui"

interface Props {
  isInverse?: boolean
  image?: React.ReactNode
  content?: React.ReactNode
  className?: string
}

const TextImage = ({ isInverse, image, content, className }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 small:gap-12 gap-4 items-center">
      <div className={clx(
        isInverse ? "md:order-2 order-1" : "md:order-1 order-2", 
        className
        )}>
        {image}
      </div>
      <div className={clx(
        isInverse ? "md:order-1 order-2" : "md:order-1 order-2", 
        className
        )}>
        {content}
      </div>
    </div>
  )
}

export default TextImage
