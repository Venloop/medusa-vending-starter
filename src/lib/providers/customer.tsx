"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react"
import { HttpTypes } from "@medusajs/types"
import { retrieveCustomer } from "@lib/data/customer"
import { usePathname } from "next/navigation"
import { SavedPaymentMethod } from "@lib/data/payment"

type CustomerContextType = {
  customer: any | null
  isLoading: boolean
  refreshCustomer: () => Promise<void>
  setCustomerData: (customerData: HttpTypes.StoreCustomer | null) => void
  clearCustomer: () => void
}

const CustomerContext = createContext<CustomerContextType | null>(null)

type CustomerProviderProps = {
  children: React.ReactNode
}

export const CustomerProvider = ({ children }: CustomerProviderProps) => {
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const pathname = usePathname()

  const refreshCustomer = useCallback(async () => {
    try {
      setIsLoading(true)
      const customerData = await retrieveCustomer()
      console.log(
        "👤 CustomerProvider - Customer data retrieved:",
        customerData
      )
      setCustomer(customerData)
    } catch (error) {
      console.error(
        "👤 CustomerProvider - Error while fetching customer data:",
        error
      )
      setCustomer(null)
    } finally {
      setIsLoading(false)
      setIsInitialized(true)
    }
  }, [])

  const setCustomerData = (customerData: HttpTypes.StoreCustomer | null) => {
    console.log(
      "👤 CustomerProvider - Setting customer data:",
      customerData?.metadata
    )
    setCustomer(customerData)
  }

  const clearCustomer = () => {
    console.log("👤 CustomerProvider - Clearing customer data")
    setCustomer(null)
    setIsLoading(false)
  }

  useEffect(() => {
    if (!isInitialized) {
      console.log("👤 CustomerProvider - Initialization, loading customer data")
      refreshCustomer()
    } else if (!customer && pathname) {
      console.log(
        "👤 CustomerProvider - Path changed, checking if the user is logged in"
      )
      refreshCustomer()
    }
  }, [pathname, customer, refreshCustomer, isInitialized])

  return (
    <CustomerContext.Provider
      value={{
        customer,
        isLoading,
        refreshCustomer,
        setCustomerData,
        clearCustomer,
      }}
    >
      {children}
    </CustomerContext.Provider>
  )
}

export const useCustomer = () => {
  const context = useContext(CustomerContext)

  if (!context) {
    throw new Error("useCustomer must be used within a CustomerProvider")
  }

  return context
}
