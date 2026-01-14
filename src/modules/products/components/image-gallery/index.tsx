import { HttpTypes } from "@medusajs/types"
import { Carousel } from "@modules/pos-locations/components/carousel"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  thumbnail?: string | null
}

const ImageGallery = ({ images, thumbnail }: ImageGalleryProps) => {
  return (
    <Carousel images={images} thumbnail={thumbnail || null} />
  )
}

export default ImageGallery
