import { retrieveCart } from "@lib/data/cart"
import CartDropdown from "../cart-dropdown"

type CartButtonProps = {
  disableDropdown?: boolean
}

export default async function CartButton({
  disableDropdown = false,
}: CartButtonProps = {}) {
  const cart = await retrieveCart().catch(() => null)

  return <CartDropdown cart={cart} disableDropdown={disableDropdown} />
}
