import React from "react"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"
import Section from "@modules/common/sections/section"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <Section spacingTop="alt" spacingBottom="alt" data-testid="account-page">
      <div className="grid grid-cols-1 small:grid-cols-[380px_1fr] gap-x-12">
        <div>{customer && <AccountNav customer={customer} />}</div>
        <div className="flex-1">{children}</div>
      </div>
    </Section>
  )
}

export default AccountLayout
