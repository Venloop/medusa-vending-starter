import { Suspense } from "react"
import { getTranslations } from "next-intl/server"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import { Logo } from "@modules/layout/components/logo"
import IconCart from "@modules/common/icons/cart"

type NavProps = {
  disableCartDropdown?: boolean
}

export default async function Nav({
  disableCartDropdown = false,
}: NavProps = {}) {
  const t = await getTranslations()

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-[5.5rem] mx-auto duration-200 bg-orange-50">
        <nav className="content-container flex items-center justify-between w-full h-full">
          <div className="flex-1 basis-0 h-full items-center flex small:hidden">
            <div className="h-full">
              <SideMenu />
            </div>
          </div>

          <div className="items-center h-full hidden small:flex">
            <LocalizedClientLink href="/" data-testid="nav-store-link">
              <Logo />
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-14 h-full flex-1 basis-0 justify-center ml-auto">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="text-base font-bold text-white"
                href="/store"
                data-testid="nav-account-link"
              >
                {t("buyOnline")}
              </LocalizedClientLink>
            </div>
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="text-base font-bold text-white"
                href="/pos/locations"
                data-testid="nav-account-link"
              >
                {t("buyPos")}
              </LocalizedClientLink>
            </div>
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="text-base font-bold text-white"
                href="/account"
                data-testid="nav-account-link"
              >
                {t("account")}
              </LocalizedClientLink>
            </div>
          </div>

          <div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="flex items-center justify-center gap-1 md:gap-2.5 md:h-14 w-32 md:w-40 bg-yellow-500 text-black md:px-4 md:py-2 px-2 py-2 rounded-lg"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <IconCart className="w-5 h-5 md:w-5 md:h-6 flex-shrink-0" />
                  <span className="flex flex-col text-left text-sm md:text-base">
                    <span className="text-sm font-normal leading-none mb-1 md:mb-1">{`${t(
                      "myCart"
                    )}`}</span>
                    <span className="text-base font-bold leading-none">0</span>
                  </span>
                </LocalizedClientLink>
              }
            >
              <CartButton disableDropdown={disableCartDropdown} />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
