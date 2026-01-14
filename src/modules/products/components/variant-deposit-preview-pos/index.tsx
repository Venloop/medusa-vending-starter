import { Text } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"

import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { getPricesForVariant } from "@lib/util/get-product-price"
import { Heading } from "@modules/common/components/heading"
import { clx } from "@medusajs/ui"

export default function VariantDepositPreviewPos({
  type,
  variant,
  product,
  url,
}: {
  type: string
  variant: HttpTypes.StoreProductVariant
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  url?: string
}) {
  // Function to extract option values without dates (dots)
  const getNonDateValue = () => {
    if (!variant.options) return null

    const nonDateOption = variant.options.find((option) => {
      // Check whether the value does not contain dots (dates)
      return option.value && !option.value.includes(".")
    })

    return nonDateOption ? nonDateOption.value : null
  }

  const cheapestPrice = getPricesForVariant(variant)

  const options = [] as string[]

  const productTitle = product?.title || variant?.title
  const weight = getNonDateValue()

  if (weight) {
    options.push(`${weight}g`)
  }

  return (
    <div
      className={clx(
        "flex flex-col sm:flex-col h-full",
        type === "unauthorized" && "opacity-50"
      )}
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
                <Heading
                  level="h3"
                  gendre="t7"
                  className="overflow-hidden text-ellipsis sm:text-base"
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
    </div>
  )
}
