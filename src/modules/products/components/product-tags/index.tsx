import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import { Badge } from "@modules/common/components/badge"
import { cva } from "cva"

const productTagsVariants = cva({
  base: "flex gap-2"
})

type ProductTagsProps = {
  tags: HttpTypes.StoreProductTag[]
  className?: string
}

const ProductTags = ({ tags, className }: ProductTagsProps) => {

  return (
    <div className={clx(productTagsVariants({  }), className)}>
      {tags.map((tag) => (
        <div key={tag.id}>
          <Badge color="green" rounded="full" size="small">{tag.value}</Badge>
        </div>
      ))}
    </div>
  )
}

export default ProductTags
