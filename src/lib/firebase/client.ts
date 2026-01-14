"use client"

import { useEffect } from "react"
import { messaging } from "@lib/firebaseConfig"
import { getToken, onMessage } from "firebase/messaging"
import { toast } from "@medusajs/ui"

const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY

const FirebaseGetToken = async () => {
  if (!messaging) return null
  return await getToken(messaging, {
    vapidKey: vapidKey,
  })
}

const FirebaseWorker = () => {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return

    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((registration) => {
        console.log("✅ SW zarejestrowany:", registration)
        // Get token
        return getToken(messaging!, {
          vapidKey,
          serviceWorkerRegistration: registration,
        })
      })
      .then((token) => {
        if (token) {
          console.log("📲 Firebase Token:", token)
          // Send the token to your Medusa back end if needed
        } else {
          console.warn("⚠️ Brak uprawnień do notyfikacji lub odmowa")
        }
      })
      .catch((err) => {
        console.error("❌ Failed to register SW or retrieve token:", err)
      })

    onMessage(messaging, (payload) => {
      console.log("📥 Foreground FCM:", payload)
      const { title, body } = payload.notification ?? {}
      if (Notification.permission === "granted" && title && body) {
        new Notification(title, {
          body,
          tag: "message-alert",
          requireInteraction: false,
          silent: false,
        })

        toast.info(body)
      }
    })
  }, [])

  return null
}

export { FirebaseWorker, FirebaseGetToken }
