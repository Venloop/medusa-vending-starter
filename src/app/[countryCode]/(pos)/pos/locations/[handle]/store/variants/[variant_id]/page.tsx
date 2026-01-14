import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getVariant } from "@lib/data/products"
import { getLocation } from "@lib/data/locations"
import { getRegion } from "@lib/data/regions"
import VariantTemplate from "@modules/products/variant-templates"
import { HttpTypes } from "@medusajs/types"
import { pageTitleSufix } from "@lib/constants"

type Props = {
  params: Promise<{ countryCode: string; handle: string; variant_id: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const variant = await getVariant({
    variant_id: params.variant_id,
    countryCode: params.countryCode,
    regionId: region.id,
  }).then(({ response }) => response.variant)

  if (!variant) {
    notFound()
  }

  return {
    title: `${variant.product?.title} ${pageTitleSufix}`,
    description: `${variant.product?.title}`,
    openGraph: {
      title: `${variant.product?.title} ${pageTitleSufix}`,
      description: `${variant.product?.title}`,
      images: variant.product?.thumbnail ? [variant.product.thumbnail] : [],
    },
  }
}

export default async function VariantPage(props: Props) {
  const { handle } = await props.params
  const params = await props.params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const variant = await getVariant({
    variant_id: params.variant_id,
    countryCode: params.countryCode,
    regionId: region.id,
  }).then(({ response }) => response)

  const location = await getLocation({
    location_id: handle,
  }).then(({ response }) => response.location[0])

  return (
    <VariantTemplate
      variant={variant.variant}
      product={variant.variant.product as HttpTypes.StoreProduct}
      location={location}
    />
  )
}
