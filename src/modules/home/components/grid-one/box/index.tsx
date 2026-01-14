import { Heading } from "@modules/common/components/heading"
import { ReactNode } from "react"

interface BoxProps {
  title: string
  subTitle: string
  children?: ReactNode
}

const Box = ({ title, subTitle, children }: BoxProps) => {
  return (
    <div className="flex flex-col border border-grey-30 rounded-2xl md:p-8 p-4">
      <header className="flex-1 md:mb-8 mb-4">
        <Heading level="h3" gendre="t3" className="md:mb-2 mb-1">
          {title}
        </Heading>

        <p className="text-grey-90 md:text-xl text-base">{subTitle}</p>
      </header>

      {children}
    </div>
  )
}

export default Box
