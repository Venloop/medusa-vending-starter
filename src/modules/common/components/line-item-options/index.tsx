"use client"

import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type LineItemOptionsProps = {
  variant: HttpTypes.StoreProductVariant | undefined
  "data-testid"?: string
  "data-value"?: HttpTypes.StoreProductVariant
}

const LineItemOptions = ({
  variant,
  "data-testid": dataTestid,
  "data-value": dataValue,
}: LineItemOptionsProps) => {
  if (!variant) return null

  const main: string[] = []

  const kcal = variant?.metadata?.cms_number_of_kcal
  const portions = variant?.metadata?.cms_number_of_portions
  const weight = variant?.options?.[0]?.value

  if (weight) {
    main.push(`${weight}g`)
  }

  if (kcal) {
    main.push(`${kcal} kcal na 100g`)
  }

  if (portions) {
    main.push(`${portions}`)
  }

  if (main.length === 0) return null

  return (
    <Text
      data-testid={dataTestid}
      data-value={dataValue}
      className="inline-block w-full overflow-hidden text-ellipsis text-xs"
    >
      {main.join(" • ")}
    </Text>
  )
}

export default LineItemOptions
