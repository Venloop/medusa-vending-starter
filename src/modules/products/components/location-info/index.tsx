import { Button } from "@modules/common/components/button"
import IconLocation from "@modules/common/icons/location"
import IconUnlock from "@modules/common/icons/unlock"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getTranslations } from "next-intl/server"

type LocationInfoProps = {
  location: any
}

const LocationInfo = async ({ location }: LocationInfoProps) => {
  const t = await getTranslations()

  return (
    <div className="flex flex-col mt-4 bg-yellow-50 p-4 rounded-lg">
      <p className="flex items-center justify-center gap-2 mb-4">
        <IconLocation className="w-6 h-6" />
        <span className="text-base">{t("LocationInfo.selectedLocation")} <strong>{location?.name}</strong></span>
      </p>
      <Button asChild className="w-full">
        <LocalizedClientLink href={`/pos/locations/${location?.id}/store/buy`}>
          <IconUnlock className="w-6 h-6" />
          {t("LocationInfo.openDevice")}
        </LocalizedClientLink>
      </Button>
  </div>
  )
}

export default LocationInfo
