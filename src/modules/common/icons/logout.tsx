import React from "react"
import { IconProps } from "types/icon"

const Logout: React.FC<IconProps> = ({
  size = "16",
  color = "currentColor",
  ...attributes
}) => (
  <svg {...attributes} fill={color} height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="m5.30775 20.5c-.50517 0-.93275-.175-1.28275-.525s-.525-.7776-.525-1.2827v-13.38455c0-.50517.175-.93275.525-1.28275s.77758-.525 1.28275-.525h6.70175v1.5h-6.70175c-.077 0-.1475.03208-.2115.09625-.06417.064-.09625.1345-.09625.2115v13.38455c0 .0769.03208.1475.09625.2115.064.0641.1345.0962.2115.0962h6.70175v1.5zm10.92305-4.2308-1.0385-1.0847 2.4347-2.4345h-8.53075v-1.5h8.53075l-2.4347-2.4345 1.0385-1.08475 4.2692 4.26925z" /></svg>
)

export default Logout
