import { Button } from "@modules/common/components/button"
import { Heading } from "@modules/common/components/heading"
import Thumbnail from "@modules/products/components/thumbnail"
import { useTranslations } from "next-intl"

type LocationTriggerProps = {
  title: string
  onClose?: () => void
}

const ModalWarning = ({ title, onClose }: LocationTriggerProps) => {
  const t = useTranslations("StorePos")
  
  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 p-4 bg-black/50 border-t border-grey-150">
        <div className="max-w-180 mx-auto bg-white md:p-12 p-4 rounded-xl text-center flex flex-col items-center justify-center">
            <Thumbnail
                thumbnail={`/images/store-error.png`}
                images={[`/images/store-error.png`]}
                size="square"
                className="md:w-40 md:h-40 w-20 h-20 mb-2 md:mb-4"
            />        
            <Heading level="h2" gendre="t5" className="mb-4 text-center">
              {title}
            </Heading>
            <Button variant="outline" onClick={onClose}>
                {t("closeModal")}
            </Button>
        </div>
      </div>
    </>
  )
}

export default ModalWarning
