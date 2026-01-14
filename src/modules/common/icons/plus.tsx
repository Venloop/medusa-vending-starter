import React from "react"

import { IconProps } from "types/icon"

const Plus: React.FC<IconProps> = ({
  size = "16",
  color = "currentColor",
  ...attributes
}) => {
  return (
    <svg {...attributes} fill={color} height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="m11.25 12.75h-5.75v-1.5h5.75v-5.75h1.5v5.75h5.75v1.5h-5.75v5.75h-1.5z" /></svg>
  )
}

export default Plus
