"use client"

import { 
  createContext, 
  useContext, 
  useEffect, 
  useState,
  useRef,
  Dispatch,
  SetStateAction,
  useMemo,
} from "react"
import { HttpTypes } from "@medusajs/types"
import { retrieveCustomer } from "@lib/data/customer"
import { 
  collection, 
  doc, 
  getDoc, 
  onSnapshot 
} from "firebase/firestore"
import { db } from "@lib/firebaseConfig"
import { retrieveCartReturnVenloop, retrieveCartVenloop } from "@lib/data/cart-pos"
import { listSessions } from "@lib/data/pos"
import { useCustomer } from "@lib/providers/customer"
import { useAbortableEffect } from "@lib/hooks/useAbortableEffect"

import { usePathname } from "next/navigation"

type FirebaseData = {
  [key: string]: any
}

type FirebaseContextType = {
  error: string | null
  loading: boolean
  sessionData: FirebaseData | null
  setSessionData: (data: FirebaseData | null) => void
  sessionId: string | null
  session: any | null
  sessions: any[]
  isSessionsLoading: boolean
  fetchSessions: () => Promise<void>
  cart: any | null
  setCart: (cart: any) => void
  setActiveSessionFilter: Dispatch<SetStateAction<{ device_id?: string; type?: string } | null>>
  activeSessionFilter: { device_id?: string; type?: string } | null
}

const FirebaseContext = createContext<FirebaseContextType | null>(null)

export const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [cart, setCart] = useState<any | null>(null)
  const [sessionData, setSessionData] = useState<FirebaseData | null>(null)
  const [sessions, setSessions] = useState<any[]>([])
  const [session, setSession] = useState<any | null>(null)
  const [isSessionsLoading, setIsSessionsLoading] = useState(false)
  const [activeSessionFilter, setActiveSessionFilter] = useState<{ device_id?: string; type?: string } | null>(null)

  const pathname = usePathname()
  const { customer } = useCustomer()

  const fetchSessions = async () => {
    try {
      setIsSessionsLoading(true)
      const { response: { sessions } } = await listSessions()
      console.log(`sessions - ${pathname}`, sessions)
      setSessions(sessions)
    } catch (error) {
      setSessions([])
    } finally {
      setIsSessionsLoading(false)
    }
  }

  // Get sessions from Medusa API always on mount and never cache
  useAbortableEffect(({ isAborted }) => {
    if (!customer?.id) {
      setSessions([])
      setSession(null)
      return
    }
    
    const loadSessions = async () => {
      try {
        setIsSessionsLoading(true)
        const { response: { sessions } } = await listSessions()
        
        if (!isAborted()) {
          console.log(`sessions - ${pathname}`, sessions)
          setSessions(sessions)
        }
      } catch (error) {
        if (!isAborted()) {
          setSessions([])
        }
      } finally {
        setIsSessionsLoading(false)
      }
    }

    loadSessions()
  }, [pathname, customer?.id])

  // Automatically set session from sessions customer
  useEffect(() => {
    let matchingSession = null

    // If active filter is set, use it to find session
    if (activeSessionFilter) {
      matchingSession = sessions.find(sess => {
        // Only check properties that are explicitly provided in the filter
        const matchesType = activeSessionFilter.type === undefined || sess?.type === activeSessionFilter.type
        const matchesDevice = activeSessionFilter.device_id === undefined || sess?.device_id === activeSessionFilter.device_id
        return matchesType && matchesDevice
      })
    } else {
      // Otherwise, find first session where type is in pathname
      matchingSession = sessions.find(sess => {
        const currentMode = sess?.type
        const isModeInPath = !!currentMode && pathname.split("/").includes(currentMode)
        return isModeInPath
      })
    }

    if (matchingSession) {
      setSession(matchingSession)
    } else {
      setSession(null)
      setSessionData(null)
    }
  }, [sessions, pathname, activeSessionFilter])

  useAbortableEffect(({ isAborted }) => {
    const sessionId = session?.session_id

    if (!sessionId) {
      setSessionData(null)
      setLoading(false)
      return
    }

    setError(null)
    setLoading(true)

    const ref = doc(db, "sessions", sessionId)

    const unsub = onSnapshot(
      ref, 
      async (snap) => {
        if (snap.exists()) {
          const data = snap.data()
          setSessionData(data)

          // Automatically get cart if cart_id and status is active
          if (data?.cart_id && data?.type === 'return') {
            try {
              const getCart = await retrieveCartReturnVenloop(data.cart_id)
              if (!isAborted()) {
                console.log("🔥 Updated return cart:", getCart)
                setCart(getCart)
              }
            } catch (error: any) {
              console.error("Error fetching return cart:", error)
            }
          } else if (data?.cart_id && data?.type === 'buy') {
            try {
              const getCart = await retrieveCartVenloop(data.cart_id)
              if (!isAborted()) {
                console.log("🔥 Updated cart:", getCart)
                setCart(getCart)
              }
            } catch (error: any) {
              console.error("Error fetching cart:", error)
            }
          } else {
            setCart(null)
          }

          setError(null)
          setLoading(false)
        } else {
          setSessionData(null)
          setError("Session not exists.")
        }
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsub()
  }, [session?.session_id])

  return (
    <FirebaseContext.Provider value={{ 
      sessionData,
      setSessionData,
      error,
      loading,
      cart,
      setCart,
      isSessionsLoading,
      sessionId: session?.session_id || null,
      session,
      sessions,
      fetchSessions,
      setActiveSessionFilter,
      activeSessionFilter
    }}>
      {children}
    </FirebaseContext.Provider>
  )
}

export const useFirebase = (filter?: { device_id?: string; type?: string }) => {
  const context = useContext(FirebaseContext)
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider")
  }

  const stableFilter = useMemo(() => {
    if (!filter) return null
    return filter
  }, [filter?.device_id, filter?.type])

  const ourFilter = useRef<{ device_id?: string; type?: string } | null>(null)

  useEffect(() => {
    if (stableFilter) {
      context.setActiveSessionFilter(stableFilter)
      ourFilter.current = stableFilter
    }
    
    return () => {
      if (stableFilter && ourFilter.current) {
        setTimeout(() => {
          context.setActiveSessionFilter((currentFilter) => {
            const ourFilterStr = JSON.stringify(ourFilter.current)
            const currFilterStr = JSON.stringify(currentFilter)
            
            if (ourFilterStr === currFilterStr) {
              return null
            }
            return currentFilter
          })
        }, 10) 
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stableFilter])

  return context
}