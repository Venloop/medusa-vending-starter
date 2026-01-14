import { Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import { Heading } from "@modules/common/components/heading"
import IconArrowRight from "@modules/common/icons/arrow-2-right"

export default async function LocationPreview({
  location,
}: {
  location: any
}) {
  return (
    <LocalizedClientLink href={`/pos/locations/${location.id}/`} className="group">
      <div>
        <Thumbnail
          thumbnail={location?.metadata?.thumbnail}
          size="full"
          isFeatured={true}
        />
        <div className="flex items-center txt-compact-medium p-4 justify-between">
          <Heading
            level="h3"
            gendre="t4"
          >
            {location.name}
          </Heading>
          <IconArrowRight className="w-4 h-4 fill-brown-600" />
        </div>
      </div>
    </LocalizedClientLink>
  )
}
