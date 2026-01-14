import { Metadata } from "next"
import { retrieveCustomer } from "@lib/data/customer"
import { getLocation } from "@lib/data/locations"
import { redirect } from "next/navigation"
import { getRegion } from "@lib/data/regions"
import { FirestoreDeviceProvider } from "@lib/providers/firebase-device"
import Debug from "@modules/store-pos/components/debug"
import Start from "@modules/store-pos/components/start"
import { pageTitleSufix } from "@lib/constants"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("MetaData")
  
  return {
    title: `${t("posBoxTitle")} ${pageTitleSufix}`,
    description: t("posBoxDescription"),
  }
}

type Params = {
  searchParams: Promise<{
    debug?: string
  }>
  params: Promise<{
    countryCode: string
    handle: string
  }>
}

export default async function PosBuyPage(props: Params) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const customer = await retrieveCustomer().catch(() => null)
  const debug = searchParams?.debug === '1'
  const mode = "normal"
  const type = "buy"

  if (!customer) {
    redirect(`/${params.countryCode}/account/?redirect=/pos/locations/${params.handle}/store/buy`)
  }

  const region = await getRegion('pl')

  const location = await getLocation({
    location_id: params.handle,
  }).then(({ response }) => {
    return response.location[0]
  })

  const t = await getTranslations("PosPage.Buy")

  const steps = [
    {
      title: t("step1Title"),
      description: t("step1Description"),
      image: "/images/ico-2.svg"
    },
    {
      title: t("step2Title"),
      description: t("step2Description"),
      image: "/images/ico-1.svg"
    },
    {
      title: t("step3Title"),
      description: t("step3Description"),
      image: "/images/ico-3.svg"
    }
  ]

  return (
    <>
      <FirestoreDeviceProvider location={location} mode={mode} type={type}>
        <Start items={steps} title={t("title")} location={location} debug={debug} region={region} mode={mode} type={type} countryCode={params.countryCode} />
        {debug && <Debug params={props.params} searchParams={props.searchParams} />}
      </FirestoreDeviceProvider>
    </>
  )
}
