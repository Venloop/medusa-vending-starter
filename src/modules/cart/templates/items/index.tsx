import { HttpTypes } from "@medusajs/types"
import { getTranslations } from "next-intl/server"
import ClearCartButton from "@modules/common/components/clear-cart-button"
import CartItemsList from "../../components/cart-items-list"
import { Heading } from "@modules/common/components/heading"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = async ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items || []
  const t = await getTranslations()

  return (
    <div>
      <div className="pb-4 flex items-center justify-between border-b border-gray-300">
        <Heading gendre="t3">{t("myCart")}</Heading>
        <ClearCartButton className="" data-testid="clear-cart-button">
          {t("removeAll")}
        </ClearCartButton>
      </div>

      <CartItemsList
        items={items}
        currencyCode={cart?.currency_code || ""}
        deleteButtonLabel={t("Remove")}
      />
    </div>
  )
}

export default ItemsTemplate
