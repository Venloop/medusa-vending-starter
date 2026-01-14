import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import GridOne from "@modules/home/components/grid-one"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("MetaData")
  
  return {
    title: `${t("homeTitle")}`,
    description: t("homeDescription"),
  }
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <GridOne />
    </>
  )
}
