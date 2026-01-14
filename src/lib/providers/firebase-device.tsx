"use client"

import { 
  createContext, 
  useContext, 
  useEffect, 
  useState,
} from "react"
import { 
  doc,
  onSnapshot 
} from "firebase/firestore"
import { db } from "@lib/firebaseConfig"

type FirestoreData = {
  [key: string]: any
} 

type FirestoreDeviceContextType = {
  deviceData: FirestoreData | null
  cabin: any | null
  hub: any | null
  deviceId: string | null
  lockerId: string | null
  hubId: string | null
  loading: boolean
  error: string | null
  location: any | null
}

const FirestoreDeviceContext = createContext<FirestoreDeviceContextType | null>(null)

export const FirestoreDeviceProvider = ({ children, location, mode, type }: { children: React.ReactNode, location: any, mode: string, type: string }) => {
  const [deviceData, setDeviceData] = useState<FirestoreData | null>(null)
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const [lockerId, setLockerId] = useState<string | null>(null)
  const [hubId, setHubId] = useState<string | null>(null)
  const [hub, setHub] = useState<any>([])
  const [cabin, setCabin] = useState<any>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Get sales channel data
    const sales_channel = location?.sales_channels[0]
      
    // Get device data
    const device_id = sales_channel?.pos_device?.device_id

    console.log("🔥 pos_hubs:", sales_channel?.pos_device?.pos_hubs)
    
    // Get hub data
    const hubs = sales_channel?.pos_device?.pos_hubs.find(
      (hub: any) => hub.type === type
    )

    const lockers = hubs?.pos_lockers || []
    const locker_id = lockers[0]?.locker_id

    setHub(hubs)
    setHubId(hubs?.hub_id)
    setDeviceId(device_id)
    setLockerId(locker_id)

    if (!device_id) {
      return
    }

    const refDevice = doc(db, "device_statuses", device_id)

    const unsub = onSnapshot(
      refDevice, 
      async (snap) => {
        if (snap.exists()) {
          const data = snap.data()
          console.log("🔥 Session change:", data)
          setDeviceData(data)
          setError(null)
        } else {
          setDeviceData(null)
        }
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsub()
  }, [location, type])

  useEffect(() => {
    if (deviceData) {
      const cabins = deviceData?.cabins.find(
        (cabin: any) => cabin.hub_id === hub?.hub_id
      )
      setCabin(cabins)
    }
  }, [deviceData])

  return (
    <FirestoreDeviceContext.Provider value={{ 
      deviceData, 
      cabin,
      hub,
      deviceId,
      lockerId,
      hubId,
      loading, 
      error, 
      location  
    }}>
      {children}
    </FirestoreDeviceContext.Provider>
  )
}

export const useFirestoreDevice = () => {
  const context = useContext(FirestoreDeviceContext)
  if (!context) {
    throw new Error("useFirestore must be used within a FirestoreProvider")
  }
  return context
}