"use client"

import { HttpTypes } from "@medusajs/types"
import { Heading } from "@modules/common/components/heading"
import { useTranslations } from "next-intl"
import { useMemo } from "react"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
  variant: HttpTypes.StoreProductVariant
}

const ProductCmsInfo = ({ product, variant }: ProductInfoProps) => {
  const t = useTranslations("ProductCmsInfo")
  const metadata = (product?.metadata as any) || {}
  const cms_expiry_date = variant?.metadata?.cms_expiry_date || {}

  const infoFields = useMemo(
    () => [
      {
        label: t("productDescription"),
        key: "cms_short_desc",
      },
      {
        label: t("ingredients"),
        key: "cms_ingredients",
      },
      {
        label: t("allergens"),
        key: "cms_allergens",
      },
      {
        label: t("nutritionalValues"),
        key: "cms_nutritional_values",
      },
      {
        label: t("storageConditions"),
        key: "cms_storage_conditions",
      },
      {
        label: t("preparationMethod"),
        key: "cms_method_of_preparation",
      },
    ],
    [t]
  )

  const infoFieldsVariant = useMemo(
    () => [
      {
        label: t("expiryDate"),
        key: "cms_expiry_date",
        value: Object.values(cms_expiry_date).join(", "),
      },
    ],
    [t, cms_expiry_date]
  )

  return (
    <div id="product-cms-info" className="mt-6">
      <div className="flex flex-col gap-y-4">
        {infoFields.map((field) => (
          <div key={field.key} className="pb-2 last:pb-0">
            <Heading level="h2" gendre="t4" className="mb-0.5">
              {field.label}
            </Heading>
            <div
              className="text-base"
              data-testid="product-description"
              dangerouslySetInnerHTML={{ __html: metadata[field.key] || "" }}
            />
          </div>
        ))}
        {infoFieldsVariant
          .filter((field) => field?.value)
          .map((field) => (
            <div
              key={field.key}
              className="border-grey-20 group border-b pb-4 last:pb-0 last:border-b-0"
            >
              <Heading level="h2" gendre="t4" className="mb-0.5">
                {field.label}
              </Heading>
              {field.value && <div className="text-base">{field.value}</div>}
            </div>
          ))}
      </div>
    </div>
  )
}

export default ProductCmsInfo
