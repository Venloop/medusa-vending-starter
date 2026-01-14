"use client"

import { useFirebase } from "@lib/providers/firebase"
import { retrieveCartVenloop } from "@lib/data/cart-pos"
import { useEffect } from "react"

const FirebaseFirestoreWorker = ({ session_id }: { session_id: any }) => {
  const { sessionData, loading, error, cart } = useFirebase()

  return (
    <div className="p-4 border rounded bg-white shadow overflow-hidden">
      <h1 className="text-lg font-semibold mb-2">Debug mode</h1>
      <h2 className="text-base font-semibold mb-2">Dane sesjis z Firestore:</h2>
      {sessionData ? (
        <pre className="text-sm bg-gray-100 p-2 rounded">
          {JSON.stringify(sessionData, null, 2)}
        </pre>
      ) : (
        <p className="text-gray-500">Brak danych lub trwa wczytywanie...</p>
      )}
      <h2 className="text-base font-semibold mt-4 mb-2">Dane koszyka z Firestore:</h2>
      {cart ? (
        <pre className="text-sm bg-gray-100 p-2 rounded">
          {JSON.stringify(cart, null, 2)}
        </pre>
      ) : (
        <p className="text-gray-500">Brak danych lub trwa wczytywanie...</p>
      )}
    </div>
  )
}

export { FirebaseFirestoreWorker }
