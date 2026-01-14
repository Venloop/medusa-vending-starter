import { HttpTypes } from "@medusajs/types"

export const getSizeFromOptions = (
  options: HttpTypes.StoreProductOptionValue[]
): string | null => {
  const optionSize = options.filter((option) => {
    return option?.option?.title === "Size"
  })

  return optionSize.length ? optionSize[0].value : null
}
