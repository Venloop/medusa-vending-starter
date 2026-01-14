"use client"

import { 
  createContext, 
  useContext, 
  useEffect, 
  useState,
  useCallback,
} from "react"
import { getSavedPaymentHolders, SavedPaymentMethod } from "@lib/data/payment"
import { useCustomer } from "./customer"

type PaymentsContextType = {
    refreshPaymentHolders: () => Promise<void>
    paymentHolders: Array<{ holder: any; payment_methods: SavedPaymentMethod[] }> | null
    paymentMethods: SavedPaymentMethod[]
    isLoadingPaymenHolders: boolean
}

const PaymentsContext = createContext<PaymentsContextType | null>(null)

type PaymentsProviderProps = {
  children: React.ReactNode
}

export const PaymentsProvider = ({
  children,
}: PaymentsProviderProps) => {
  const { customer } = useCustomer()
  const [isLoadingPaymenHolders, setIsLoadingPaymentHolders] = useState(false)
  const [paymentHolders, setPaymentHolders] = useState<Array<{ holder: any; payment_methods: SavedPaymentMethod[] }> | null>(null)
  const [paymentMethods, setPaymentMethods] = useState<SavedPaymentMethod[]>([])

  const refreshPaymentHolders = useCallback(async () => {
    if (!customer?.id) {
      setPaymentHolders(null)
      setPaymentMethods([])
      return
    }
 
    setIsLoadingPaymentHolders(true)

    try {
      const holders = await getSavedPaymentHolders()
      setPaymentHolders(holders)
      setPaymentMethods(holders?.[0]?.payment_methods || [])
    } catch (error) {
      console.error("Error loading payment holders:", error)
      setPaymentHolders(null)
      setPaymentMethods([])
    } finally {
      setIsLoadingPaymentHolders(false)
    }
  }, [customer?.id])

  // Automatically refresh payment methods when the customer changes
  useEffect(() => {
    refreshPaymentHolders()
  }, [refreshPaymentHolders])

  return (
    <PaymentsContext.Provider value={{
      refreshPaymentHolders,
      paymentHolders,
      paymentMethods,
      isLoadingPaymenHolders,
    }}>
      {children}
    </PaymentsContext.Provider>
  )
}

export const usePayments = () => {
  const context = useContext(PaymentsContext)

  if (!context) {
    throw new Error("usePayments must be used within a PaymentsProvider")
  }

  return context
}