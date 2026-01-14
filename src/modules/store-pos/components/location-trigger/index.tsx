import { useTranslations } from "next-intl"
import { Button } from "@modules/common/components/button"
import IconUnlock from "@modules/common/icons/unlock"
import { Heading } from "@modules/common/components/heading"
import { useFirestoreDevice } from "@lib/providers/firebase-device"
import DeviceMessage from "../device-message"

type LocationTriggerProps = {
  title: string
  location: any
  onConfirm: () => void
  isLoading: boolean
}

const LocationTrigger = ({ title, location, onConfirm, isLoading }: LocationTriggerProps) => {
  const t = useTranslations("StorePos")
  const { cabin } = useFirestoreDevice()

  const isCabinIdle = cabin?.doorstate === "IDLE"
  const isModeNormal = cabin?.mode === "normal"

  const isReady = isCabinIdle && isModeNormal
  const showDeviceError = !isReady && !isLoading

  return (
    <>
      {showDeviceError && (  
        <DeviceMessage title={t("deviceUnavailable")} variant="error" className="mb-8" />
      )}
      {isReady && (
        <>
          <div className="bg-yellow-50 p-8 rounded-lg">
            <Heading level="h2" gendre="t4" className="mb-4 text-center">
              {title}
            </Heading>
            <Button onClick={onConfirm} isLoading={isLoading} className="w-full">
              <IconUnlock className="w-6 h-6" />
              {isLoading ? t("opening") : t("yesOpen")}
            </Button>
          </div>
        </>
      )}
    </>
  )
}

export default LocationTrigger
