import { Text } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import ProductTags from "../product-tags"
import { Heading } from "@modules/common/components/heading"
import { getPricesForPosVariant } from "@lib/util/get-product-price"

export default function VariantPreviewPos({
  variant,
  product,
  isFeatured,
  url,
  item,
}: {
  variant: HttpTypes.StoreProductVariant
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  url?: string
  item: any
}) {
  // Function to extract option values without dates (dots)
  const getNonDateValue = () => {
    if (!variant.options) return "brak danych"

    const nonDateOption = variant.options.find((option) => {
      // Check whether the value does not contain dots (dates)
      return option.value && !option.value.includes(".")
    })

    return nonDateOption ? nonDateOption.value : "brak danych"
  }

  const cheapestPrice = getPricesForPosVariant(product, item)

  const options = [] as string[]

  const productTitle = product?.title || variant?.title
  const kcal = variant?.metadata?.cms_number_of_kcal
  const portions = variant?.metadata?.cms_number_of_portions
  const weight = getNonDateValue()
  const tags = product?.tags || []

  if (kcal) {
    options.push(`${kcal} kcal`)
  }

  if (portions) {
    options.push(`${portions}`)
  }

  if (weight) {
    options.push(`${weight}g`)
  }

  return (
    <LocalizedClientLink
      href={url || `/variants/${variant.id}`}
      className="flex flex-col sm:flex-col h-full"
    >
      <div className="grid grid-cols-[64px_1fr] sm:grid-cols-1 gap-x-2 sm:gap-x-0 items-center sm:items-stretch">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="square"
        />
        <div className="flex flex-col justify-between sm:justify-start flex-1 min-w-0">
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex sm:flex-col items-end sm:items-stretch justify-between sm:justify-start gap-2 sm:gap-0">
              <div className="flex flex-col overflow-ellipsis whitespace-nowrap sm:whitespace-normal flex-1 min-w-0">
                {tags.length > 0 && (
                  <ProductTags tags={tags} className="mb-2 sm:mt-2 sm:mb-4" />
                )}
                <Heading
                  level="h3"
                  gendre="t7"
                  className="overflow-hidden text-ellipsis"
                >
                  {productTitle}
                </Heading>
                {options.length > 0 && (
                  <Text
                    className="text-xs mt-1 inline-block w-full overflow-hidden text-ellipsis"
                    data-testid="product-title"
                    size="small"
                  >
                    {options.join(" • ")}
                  </Text>
                )}
              </div>
              <div className="flex flex-col justify-end self-center sm:self-stretch shrink-0 sm:mt-2">
                {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
