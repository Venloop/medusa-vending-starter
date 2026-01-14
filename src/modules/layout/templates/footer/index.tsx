import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Logo } from "@modules/layout/components/logo"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getTranslations } from "next-intl/server"

export default async function Footer() {
  const t = await getTranslations("Footer")

  return (
    <footer className="bg-brown-900 w-full md:py-12 py-8 flex flex-col gap-4 mt-auto">
      <div className="content-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <LocalizedClientLink
            href="/"
            data-testid="nav-store-link"
          >
            <Logo />
          </LocalizedClientLink>
          <div className="flex flex-row gap-4">
            <ul className="flex flex-row gap-2">
              <li>
                <LocalizedClientLink href="/privacy-policy" className="text-white text-sm md:text-base">
                  {t("privacyPolicy")}
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/terms" className="text-white text-sm md:text-base">
                  {t("terms")}
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/returns-and-claims" className="text-white text-sm md:text-base">
                  {t("returnsAndClaims")}
                </LocalizedClientLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
