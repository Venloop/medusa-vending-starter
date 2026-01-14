import { HttpTypes } from "@medusajs/types"
import { Heading } from "@modules/common/components/heading"
import { Text } from "@medusajs/ui"
import ProductVariantPrice from "@modules/products/components/product-variant-price"
import ProductTags from "@modules/products/components/product-tags"
import { getSizeFromOptions } from "@lib/util/variants"

// Extension of the StoreProductVariant type with the availability field
type ExtendedStoreProductVariant = HttpTypes.StoreProductVariant & {
  availability?: number
  depositVariant?: ExtendedStoreProductVariant
}

type ProductVariantInfo = {
  variant: ExtendedStoreProductVariant
  product: HttpTypes.StoreProduct
}

const ProductVariantInfo = ({ product, variant }: ProductVariantInfo) => {
  const depositVariant = variant?.depositVariant

  const options = [] as string[]

  const productTitle = product.title || variant.title
  const kcal = variant?.metadata?.cms_number_of_kcal
  const portions = variant?.metadata?.cms_number_of_portions
  const cms_expiry_date = variant?.metadata?.cms_expiry_date || {}
  const tags = product?.tags || []
  const weight = getSizeFromOptions(variant?.options || [])

  if (kcal) {
    options.push(`${kcal} kcal na 100g`)
  }

  if (portions) {
    options.push(`${portions}`)
  }

  if (weight) {
    options.push(`${weight}g`)
  }

  if (variant?.availability) {
    options.push(`Dostępność: ${variant?.availability}`)
  }

  return (
    <>    
      <div className="flex-1">
        {tags.length > 0 && (
          <ProductTags tags={tags} className="mt-2 mb-4" />
        )}
        <div className="">
          <div>
            <Heading level="h3" gendre="t2" className="mb-4">
              {productTitle}
            </Heading>
            {options.length > 0 && (
              <Text className="text-xs mt-1" data-testid="product-title" size="small">
                {options.join(' • ')}
              </Text>
            )}
          </div>
          <div className="mt-6">
            <ProductVariantPrice variant={variant} type="regular" />
            {depositVariant && <ProductVariantPrice variant={depositVariant} type="deposit" />}
          </div>
        </div>
      </div>
    </>
  )
}

export default ProductVariantInfo
