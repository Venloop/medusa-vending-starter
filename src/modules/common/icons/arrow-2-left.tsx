import React from "react"
import { IconProps } from "types/icon"

const Cart: React.FC<IconProps> = ({
  size = "16",
  color = "currentColor",
  ...attributes
}) => (
  <svg {...attributes} fill={color} width={size} height={size} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
<path d="M3.373 8.75L9.06925 14.4462L8 15.5L0.5 8L8 0.5L9.06925 1.55375L3.373 7.25H15.5V8.75H3.373Z" />
</svg>

)

export default Cart
