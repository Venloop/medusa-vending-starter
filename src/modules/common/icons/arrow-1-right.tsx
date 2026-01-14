import React from "react"
import { IconProps } from "types/icon"

const Cart: React.FC<IconProps> = ({
  size = "16",
  color = "currentColor",
  ...attributes
}) => (
  <svg {...attributes} fill={color} width={size} height={size} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
<path d="M12.627 8.75H0.5V7.25H12.627L6.93075 1.55375L8 0.5L15.5 8L8 15.5L6.93075 14.4462L12.627 8.75Z" />
</svg>
)

export default Cart
