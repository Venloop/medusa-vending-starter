import { Suspense } from "react"
import { getTranslations } from "next-intl/server"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import { Logo } from "@modules/layout/components/logo"
import IconCart from "@modules/common/icons/cart"

export default async function Nav() {
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
            <LocalizedClientLink
              href="/"
              data-testid="nav-store-link"
            >
              <Logo />
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-14 h-full flex-1 basis-0 justify-end ml-auto">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="text-base font-bold text-white"
                href="/store"
                data-testid="nav-account-link"
              >
                {t('buyOnline')}
              </LocalizedClientLink>
            </div>
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="text-base font-bold text-white"
                href="/pos/locations"
                data-testid="nav-account-link"
              >
                {t('buyPos')}
              </LocalizedClientLink>
            </div>
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="text-base font-bold text-white"
                href="/account"
                data-testid="nav-account-link"
              >
                {t('account')}
              </LocalizedClientLink>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
