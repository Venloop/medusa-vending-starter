"use client"

import { clx } from "@medusajs/ui"
import { ArrowRightOnRectangle } from "@medusajs/icons"
import { useParams, usePathname } from "next/navigation"

import ChevronDown from "@modules/common/icons/chevron-down"
import User from "@modules/common/icons/user"
import MapPin from "@modules/common/icons/map-pin"
import Package from "@modules/common/icons/package"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { signout } from "@lib/data/customer"
import { useCustomer } from "@lib/providers/customer"
import { Button } from "@modules/common/components/button"
import { Heading } from "@modules/common/components/heading"
import Dashboard from "@modules/common/icons/dashboard"
import AccountCircle from "@modules/common/icons/account-circle"
import Address from "@modules/common/icons/address"
import Orders from "@modules/common/icons/orders"
import Payments from "@modules/common/icons/payments"
import Logout from "@modules/common/icons/logout"
import { useTranslations } from "next-intl"

const AccountNav = ({
  customer,
}: {
  customer: HttpTypes.StoreCustomer | null
}) => {
  const route = usePathname()
  const { countryCode } = useParams() as { countryCode: string }
  const { clearCustomer } = useCustomer()
  const t = useTranslations("Account.Nav")

  const handleLogout = async () => {
    clearCustomer()
    await signout(countryCode)
  }

  return (
    <div>
      <div className="small:hidden" data-testid="mobile-account-nav">
        {route !== `/${countryCode}/account` ? (
          <Button asChild variant="outline" size="small" className="mb-4">
            <LocalizedClientLink
              href="/account"
              data-testid="account-main-link"
            >
              <>
                <ChevronDown className="transform rotate-90" />
                <span>{t("account")}</span>
              </>
            </LocalizedClientLink>
          </Button>
        ) : (
          <>
            <Heading gendre="t4" className="text-grey-60 mb-4">{t("hello", { name: customer?.first_name || "" })}</Heading>

            <ul className="flex flex-col gap-y-4">
              <li>
                <AccountNavLink
                  route={route!}
                  href="/account/profile"
                  data-testid="profile-link"
                >
                  <>
                    <AccountCircle className="w-6 h-6" />
                    <span>{t("profile")}</span>
                    <ChevronDown className="transform -rotate-90 ml-auto" />
                  </>
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/addresses"
                  route={route!}
                  data-testid="addresses-link"
                >
                  <Address className="w-6 h-6" />
                  <span>{t("addresses")}</span>                    
                  <ChevronDown className="transform -rotate-90 ml-auto" />
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/orders"
                  route={route!}
                  data-testid="orders-link"
                >
                  <Orders className="w-6 h-6" />
                  <span>{t("orders")}</span>
                  <ChevronDown className="transform -rotate-90 ml-auto" />
                </AccountNavLink>
              </li>
              <li>
                <AccountNavLink
                  href="/account/cards"
                  route={route!}
                  data-testid="carts-link"
                >
                  <Payments className="w-6 h-6" />
                  <span>{t("cards")}</span>
                  <ChevronDown className="transform -rotate-90 ml-auto" />
                </AccountNavLink>
              </li>
              <li>
                <LogoutButton
                  onClick={handleLogout}
                  data-testid="logout-button"
                >
                  <Logout className="w-6 h-6" />
                  <span>{t("logOut")}</span>
                  <ChevronDown className="transform -rotate-90 ml-auto" />
                </LogoutButton>
              </li>
            </ul>
          </>
        )}
      </div>
      <div className="hidden small:block" data-testid="account-nav">
        <div>
          <Heading gendre="t4" className="text-grey-60 mb-4">{t("myAccount")}</Heading>
          <ul className="flex flex-col gap-y-4">
            <li>
              <AccountNavLink
                href="/account"
                route={route!}
                data-testid="overview-link"
              >
                <Dashboard className="w-6 h-6" />
                {t("generalInfo")}
              </AccountNavLink>
            </li>
            <li>
              <AccountNavLink
                href="/account/profile"
                route={route!}
                data-testid="profile-link"
              >
                <AccountCircle className="w-6 h-6" />
                {t("profile")}
              </AccountNavLink>
            </li>
            <li>
              <AccountNavLink
                href="/account/addresses"
                route={route!}
                data-testid="addresses-link"
              >
                <Address className="w-6 h-6" />
                {t("addresses")}
              </AccountNavLink>
            </li>
            <li>
              <AccountNavLink
                href="/account/orders"
                route={route!}
                data-testid="orders-link"
              >
                <Orders className="w-6 h-6" />
                {t("orders")}
              </AccountNavLink>
            </li>
            <li>
              <AccountNavLink
                href="/account/cards"
                route={route!}
                data-testid="carts-link"
              >
                <Payments className="w-6 h-6" />
                {t("paymentMethods")}
              </AccountNavLink>
            </li>
            <li>
              <LogoutButton
                onClick={handleLogout}
                data-testid="logout-button"
              >
                <Logout className="w-6 h-6" />
                {t("logOut")}
              </LogoutButton>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

type AccountNavLinkProps = {
  href: string
  route: string
  children: React.ReactNode
  "data-testid"?: string
}

type LogoutButtonProps = {
  onClick: () => void
  children: React.ReactNode
  "data-testid"?: string
}

const LogoutButton = ({
  onClick,
  children,
  "data-testid": dataTestId,
}: LogoutButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={clx("flex w-full gap-2 py-2 px-4 text-base rounded-md fill-grey-70 text-grey-70 hover:bg-grey-10 hover:text-grey-60")}
      data-testid={dataTestId}
    >
      {children}
    </button>
  )
}

const AccountNavLink = ({
  href,
  route,
  children,
  "data-testid": dataTestId,
}: AccountNavLinkProps) => {
  const { countryCode }: { countryCode: string } = useParams()

  const active = route.split(countryCode)[1] === href
  return (
    <LocalizedClientLink
      href={href}
      className={clx("flex items-center w-full gap-2 py-2 px-4 text-base rounded-md fill-grey-70 text-grey-70 hover:bg-grey-10 hover:text-grey-60", {
        "bg-grey-10 text-grey-60 font-bold": active,
      })}
      data-testid={dataTestId}
    >
      {children}
    </LocalizedClientLink>
  )
}

export default AccountNav
