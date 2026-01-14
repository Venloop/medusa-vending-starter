import { Text } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { getPricesForVariant } from "@lib/util/get-product-price"
import ProductTags from "../product-tags"
import { Heading } from "@modules/common/components/heading"
import { Button } from "@modules/common/components/button"
import { getSizeFromOptions } from "@lib/util/variants"

type ExtendedStoreProductVariant = HttpTypes.StoreProductVariant & {
  availability?: number
  depositVariant?: ExtendedStoreProductVariant
}

const getVariantOptions = (
  variant: ExtendedStoreProductVariant,
  cms_expiry_date?: any,
  depositPrice?: any
): { main: string[]; secondary: string[] } => {
  const main: string[] = []
  const secondary: string[] = []

  const kcal = variant?.metadata?.cms_number_of_kcal
  const portions = variant?.metadata?.cms_number_of_portions
  const weight = getSizeFromOptions(variant?.options || [])

  if (kcal) {
    main.push(`${kcal} kcal na 100g`)
  }

  if (portions) {
    main.push(`${portions}`)
  }

  if (weight) {
    main.push(`${weight}g`)
  }

  if (depositPrice) {
    secondary.push(`Kaucja: ${depositPrice?.calculated_price}`)
  }

  if (variant?.availability !== null && variant?.availability !== undefined) {
    secondary.push(`Dostępność: ${variant?.availability}`)
  }

  if (cms_expiry_date?.length) {
    secondary.push(`Terminy: ${Object.values(cms_expiry_date).join(", ")}`)
  }

  return {
    main: main.filter((option) => option),
    secondary: secondary.filter((option) => option),
  }
}

export default function VariantPreview({
  variant,
  product,
  url,
}: {
  variant: HttpTypes.StoreProductVariant & {
    depositVariant?: HttpTypes.StoreProductVariant
  }
  product: HttpTypes.StoreProduct
  url?: string
}) {
  const depositPrice = getPricesForVariant(variant?.depositVariant)
  const cheapestPrice = getPricesForVariant(variant)

  const productTitle = product?.title || variant?.title
  const cms_expiry_date = variant?.metadata?.cms_expiry_date || []
  const tags = product?.tags || []
  const { main: mainOptions, secondary: secondaryOptions } = getVariantOptions(
    variant,
    cms_expiry_date,
    depositPrice
  )

  return (
    <LocalizedClientLink
      href={url || `/variants/${variant.id}`}
      className="flex flex-col h-full"
    >
      <Thumbnail
        thumbnail={product.thumbnail}
        images={product.images}
        size="square"
      />
      <div className="flex-1">
        {tags.length > 0 && <ProductTags tags={tags} className="mt-2 mb-4" />}
        <div className="">
          <div>
            <Heading level="h3" gendre="t4">
              {productTitle}
            </Heading>
            {mainOptions.length > 0 && (
              <Text
                className="text-xs mt-1"
                data-testid="product-title"
                size="small"
              >
                {mainOptions.join(" • ")}
              </Text>
            )}
          </div>
          <div className="mt-2">
            <div className="mb-0.5">
              {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            </div>
            {secondaryOptions.length > 0 && (
              <Text className="text-xs" data-testid="product-secondary-info">
                {secondaryOptions.join(", ")}
              </Text>
            )}
          </div>
        </div>
      </div>
      <Button asChild className="mt-4 w-full">
        <span>Szczegóły produktu</span>
      </Button>
    </LocalizedClientLink>
  )
}
