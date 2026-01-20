
import Link from "next/link"
import Image from "next/image"
import { getTranslations } from "next-intl/server"
import IconArrowRight from "@modules/common/icons/arrow-1-right"
import { Heading } from "@modules/common/components/heading"
import { Content } from "@modules/common/components/content"
import { Button } from "@modules/common/components/button"
import TextImage from "@modules/common/components/text-image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const ImageBox = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <Image src={src} alt={alt} width={500} height={500} className="w-full h-full object-cover" />
  )
}

const ContentBox = async ({ location }: { location: any }) => {
  const t = await getTranslations("PosLocations")
  
  return (
    <div>
      <Heading level="h2" gendre="t2" className="mb-4">{location.name}</Heading>
      <Content>
        <p>{location?.metadata?.description}</p>
      </Content>
      <div className="grid grid-cols-2 gap-2 mt-4 sticky bottom-0 left-0 right-0 bg-white md:relative"> 
        <Button asChild className="w-full">
          <LocalizedClientLink href={`/pos/locations/${location?.id}/store/buy`}>
            {t("openVenloop")}
            <IconArrowRight className="md:w-6 md:h-6 w-4 h-4" />
          </LocalizedClientLink>
        </Button> 
        <Button asChild className="w-full">
          <LocalizedClientLink href={`/pos/locations/${location?.id}/store/return`}>
            {t("returnPackaging")}
            <IconArrowRight className="md:w-6 md:h-6 w-4 h-4" />
          </LocalizedClientLink>
        </Button>      
      </div>
    </div>
  )
}

const DetailsLocation = async ({ location }: { location: any }) => {
  const t = await getTranslations("PosLocations")
  const src = location?.metadata?.thumbnail || "/images/pic-placeholder.jpg"
  
  return (
    <>
      <TextImage isInverse={false} image={<ImageBox src={src} alt={t("familyJarAlt")} />} content={<ContentBox location={location} />} />
    </>
  )
}

export default DetailsLocation
