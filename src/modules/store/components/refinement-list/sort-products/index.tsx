"use client"

import FilterDropdown from "@modules/common/components/filter-dropdown"
import FilterRadioGroup from "@modules/common/components/filter-radio-group"
import { useTranslations } from "next-intl"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  setQueryParams: (name: string, value: SortOptions) => void
  "data-testid"?: string
}

const SortProducts = ({
  "data-testid": dataTestId,
  sortBy,
  setQueryParams,
}: SortProductsProps) => {
  const t = useTranslations()
  const sortOptions = [
    {
      value: "created_at",
      label: t("LatestArrivals"),
    },
    {
      value: "price_asc",
      label: t("PriceLowToHigh"),
    },
    {
      value: "price_desc",
      label: t("PriceHighToLow"),
    },
  ]
  const handleChange = (value: SortOptions) => {
    setQueryParams("sortBy", value)
  }

  return (
    <FilterDropdown
      title={t("SortBy")}
      items={sortOptions}
      value={sortBy}
      handleChange={handleChange}
      data-testid={dataTestId}
    />
  )
}

export default SortProducts
