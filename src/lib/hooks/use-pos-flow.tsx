import { useEffect, useState, useMemo } from "react"
import {
  openVenloop,
  closeVenloopComplete,
  retryOpenVenloop,
} from "@lib/data/pos"
import { useFirebase } from "@lib/providers/firebase"

export const usePos = ({
  location,
  region,
  mode,
  type,
  countryCode,
}: {
  location: any
  region: any
  mode: string
  type: string
  countryCode: string
}) => {
  const [isOpenLoading, setIsOpenLoading] = useState(false)
  const [summaryFinished, setSummaryFinished] = useState<any>({
    count: 0,
    total: 0,
  })
  const [summary, setSummary] = useState<any>({
    count: 0,
    total: 0,
  })
  const [products, setProducts] = useState<any>({
    items: [],
  })
  const [hasCompletedFlow, setHasCompletedFlow] = useState(() => {
    return false
  })
  const [sessionPhase, setSessionPhase] = useState<
    "shopping" | "closing" | "finalizing" | null
  >(null)

  const region_id = region.id
  const location_id = location.id

  // Get sales channel data
  const sales_channel = location?.sales_channels[0]
  const sales_channel_id = sales_channel?.id

  // Get device data
  const device_id = sales_channel?.pos_device?.device_id

  const {
    sessionData,
    setSessionData,
    cart,
    setCart,
    loading: firestoreLoading,
    fetchSessions,
    sessionId,
  } = useFirebase({ type, device_id })

  const [step, setStep] = useState<
    "start" | "confirmation" | "products" | "summary" | "thank-you"
  >("start")

  // Get hub data
  const hubs = sales_channel?.pos_device?.pos_hubs.filter(
    (hub: any) => hub.type === type
  )
  const hub_id = hubs[0]?.hub_id

  // Get locker data
  const lockers = hubs[0]?.pos_lockers
  const locker_id = lockers[0]?.locker_id

  // Check if session is valid - Consolidated logic for all session state transitions
  useEffect(() => {
    if (firestoreLoading) {
      return
    }

    if (hasCompletedFlow) {
      return
    }

    console.log("🔄 StepContainer Buy Flow - Data changed:", {
      sessionData: sessionData,
      cartId: cart?.id,
      sessionId: sessionId,
      sessionStatus: sessionData?.status,
      visibleAt: sessionData?.visible_at,
      code: sessionData?.code,
    })

    // 1. No session - return to start
    if (!sessionData?.session_id) {
      console.log("✅ No session, moving to the 'start' step")
      setStep("start")
      return
    }

    // 2. Session exists but cart is not ready yet - wait
    if (!cart?.id) {
      console.log("⏳ Session exists, waiting for cart...")
      return
    }

    // 3. Error handling - stay on products screen to show error
    if (sessionData.status === "error" || sessionData.code >= 400) {
      console.log(
        "❌ Session error detected, navigating to the 'products' step (error will be handled)"
      )
      setStep("products")
      return
    }

    // 4. Active session - check phase by code
    if (sessionData.status === "active") {
      // 4a. Closing phase - door closing initiated
      if (sessionData.code === 203) {
        console.log("🚪 Active session - starting close process")
        setStep("products")
        setSessionPhase("closing")
        return
      }

      // 4b. Finalizing phase - door closed, finalizing purchase
      if (sessionData.code === 210) {
        console.log("⏳ Active session - finalizing purchase")
        setStep("products")
        setSessionPhase("finalizing")
        return
      }

      // 4c. Default: Shopping phase - user is selecting products
      console.log(`🛒 Active session - purchase phase`)
      setStep("products")
      setSessionPhase("shopping")
      return
    }

    // 5. Completed session
    if (sessionData.status === "completed") {
      console.log("✅ Session completed, moving to the 'thank-you' step")
      setStep("thank-you")
      setHasCompletedFlow(true)
      return
    }
  }, [
    sessionData?.session_id,
    sessionData?.status,
    sessionData?.code,
    cart?.id,
    firestoreLoading,
    hasCompletedFlow,
  ])

  // Cleanup after completed flow - redirect after 10 seconds
  useEffect(() => {
    if (!hasCompletedFlow) return

    const timer = setTimeout(() => {
      window.location.href = `/${countryCode}/pos/locations/${location_id}`
    }, 10000)

    return () => clearTimeout(timer)
  }, [hasCompletedFlow, location_id, countryCode])

  const nonDepositItems = useMemo(() => {
    return (
      cart?.items?.filter((item: any) => item.product_type !== "Deposit") || []
    )
  }, [cart?.items])

  const cartCalculations = useMemo(() => {
    if (!cart?.items || cart.items.length === 0) {
      return {
        summaryFinished: { count: 0, total: 0 },
        summary: { count: 0, total: 0 },
        products: [],
      }
    }

    const count =
      nonDepositItems.reduce(
        (sum: number, item: any) => sum + item.quantity,
        0
      ) || 0
    const totalAmount =
      cart.items.reduce(
        (sum: number, item: any) => sum + item.unit_price * item.quantity,
        0
      ) || 0

    return {
      summaryFinished: {
        count,
        total: totalAmount.toFixed(2),
        currency: "zł",
      },
      summary: {
        count,
        total: cart.total ? cart.total.toFixed(2) : "0.00",
        currency: "zł",
      },
      products: nonDepositItems,
    }
  }, [cart?.items, cart?.total, nonDepositItems])

  // Update states when calculations change
  useEffect(() => {
    setSummaryFinished(cartCalculations.summaryFinished)
    setSummary(cartCalculations.summary)
    setProducts(cartCalculations.products)
  }, [cartCalculations])

  /**
   * @name open
   * @description Trigger for Open Venloop
   */
  const open = async () => {
    try {
      setIsOpenLoading(true)

      console.log("🚀 Starting store opening...")

      const response = await openVenloop({
        region_id: region_id,
        sales_channel_id: sales_channel_id,
        device_id: device_id,
        hub_id: hub_id,
        locker_id: locker_id,
        location_id: location_id,
        mode: mode,
        type: type,
      })

      console.log("🔄 Server response from openVenloop:", response)
      // Refresh customer data
      await fetchSessions()

      // Set step to confirmation
      setStep("products")
    } catch (error) {
      console.error("Error while opening the store:", error)
    } finally {
      // Set isOpenLoading to false
      setIsOpenLoading(false)
    }
  }

  /**
   * @name closeComplete
   * @description Trigger for Close Venloop Complete
   * @description Debug mode. Normally is closed by code. But in debug mode, we can close it manually.
   */
  const closeComplete = async () => {
    try {
      const data = {
        session_id: sessionData?.session_id as string,
        cart_id: cart?.id as string,
        device_id: device_id,
        mode: mode,
        type: type,
      }

      const response = await closeVenloopComplete(data)

      console.log("🔄 Server response from closeVenloop:", response)
      await fetchSessions()
    } catch (error) {
      console.error("Error while closing the store:", error)
    }
  }

  /**
   * @name retryOpen
   * @description Trigger for Retry Open Venloop
   * @description Used when openVenloop fails
   */
  const retryOpen = async () => {
    try {
      const response = await retryOpenVenloop({
        session_id: sessionData?.session_id as string,
      })
      console.log("🔄 Server response from retryOpenVenloop:", response)

      await fetchSessions()
    } catch (error) {
      console.error("❌ Error during retry of opening venloop:", error)
    }
  }

  return {
    open,
    retryOpen,
    closeComplete,
    isOpenLoading,
    step,
    setStep,
    sessionData,
    device_id,
    summary,
    summaryFinished,
    products,
    sessionPhase,
  }
}
