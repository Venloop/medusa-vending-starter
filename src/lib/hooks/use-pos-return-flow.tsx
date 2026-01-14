import { useEffect, useState, useCallback } from "react"
import {
  openVenloop,
  closeVenloopComplete,
  listDepositVariants,
} from "@lib/data/pos"
import { useFirebase } from "@lib/providers/firebase"
import { useAbortableEffect } from "@lib/hooks/useAbortableEffect"

export const usePosReturnFlow = ({
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
    countUnknown: 0,
    countUnauthorized: 0,
    leftToReturn: 0,
  })
  const [summary, setSummary] = useState<any>({
    count: 0,
    total: 0,
    countUnknown: 0,
    countUnauthorized: 0,
    leftToReturn: 0,
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
  const [depositVariants, setDepositVariants] = useState<any[]>([])

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
    session,
    sessionId,
  } = useFirebase({ type, device_id })

  const [step, setStep] = useState<
    "start" | "confirmation" | "products" | "thank-you"
  >("start")

  // Get hub data
  const hubs = sales_channel?.pos_device?.pos_hubs.filter(
    (hub: any) => hub.type === type
  )
  const hub_id = hubs[0]?.hub_id

  // Get locker data
  const lockers = hubs[0]?.pos_lockers || []
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

  useAbortableEffect(
    ({ isAborted }) => {
      const fetchDepositVariants = async () => {
        try {
          const {
            response: { deposit_variants },
          } = await listDepositVariants({
            sales_channel_id: sales_channel_id,
          })
          if (!isAborted()) {
            setDepositVariants(deposit_variants)
          }
        } catch (error) {
          console.error("Failed to fetch deposit variants:", error)
        }
      }

      if (sales_channel_id) {
        fetchDepositVariants()
      }
    },
    [sales_channel_id]
  )

  useEffect(() => {
    if (
      (cart?.items && cart?.items.length > 0) ||
      (depositVariants && depositVariants.length > 0)
    ) {
      const items = cart?.items || []

      let countAuthorized = 0
      let countUnauthorized = 0
      let countUnknown = 0
      let total = 0

      items.forEach((item: any) => {
        if (item.type === "authorized") {
          countAuthorized += item.quantity
          total += item.unit_price * item.quantity
        } else if (item.type === "unauthorized") {
          countUnauthorized += item.quantity
        }

        if (item.variant_id === "unknown") {
          countUnknown += 1
        }
      })

      const depositVariantsCount = depositVariants.length
      const leftToReturn = depositVariantsCount - countAuthorized

      const summaryFinishedData = {
        total: total,
        count: countAuthorized,
        leftToReturn: leftToReturn,
        currency: "zł",
      }

      const summaryData = {
        total: total,
        count: countAuthorized,
        countUnknown: countUnknown,
        countUnauthorized: countUnauthorized,
        leftToReturn: leftToReturn,
        currency: "zł",
      }

      setSummaryFinished(summaryFinishedData)
      setSummary(summaryData)
      setProducts(items)
    } else if (cart?.items && cart?.items.length === 0) {
      const emptySummaryFinished = {
        count: 0,
        total: 0,
        countUnknown: 0,
        leftToReturn: 0,
      }

      const emptySummary = {
        count: 0,
        total: 0,
        countUnknown: 0,
        countUnauthorized: 0,
        leftToReturn: 0,
      }

      setSummaryFinished(emptySummaryFinished)
      setSummary(emptySummary)
      setProducts([])
    }
  }, [cart?.items, depositVariants])

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

  return {
    open,
    closeComplete,
    isOpenLoading,
    step,
    setStep,
    sessionData,
    device_id,
    summary,
    summaryFinished,
    products,
    depositVariants,
    sessionPhase,
  }
}
