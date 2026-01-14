import { Button } from "@modules/common/components/button"
import Link from "next/link"
import IconArrowRight from "@modules/common/icons/arrow-1-right"
import IconLocation from "@modules/common/icons/location"
import IconUnlock from "@modules/common/icons/unlock"

type LocationInfoProps = {
  location: any
}

const LocationInfo = ({ location }: LocationInfoProps) => {

  return (
    <div className="flex flex-col mt-4 bg-yellow-50 p-4 rounded-lg">
      <p className="flex items-center justify-center gap-2 mb-4">
        <IconLocation className="w-6 h-6" />
        <span className="text-base">Wybrana lokalizacja: <strong>{location?.name}</strong></span>
      </p>
      <Button asChild className="w-full">
        <Link href={`/pos/locations/${location?.id}/store/buy`}>
          <IconUnlock className="w-6 h-6" />
          Otwórz urządzenie POS
        </Link>
      </Button>
  </div>
  )
}

export default LocationInfo
