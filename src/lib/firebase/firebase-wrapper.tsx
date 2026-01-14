"use client"

import { useFirebase } from "@lib/providers/firebase"
import { FirebaseFirestoreWorker } from "@lib/firebase/firestore"

export const FirebaseWrapper = () => {
  const { session } = useFirebase()

  if (!session?.session_id) {
    return null
  }

  return <FirebaseFirestoreWorker session_id={session.session_id} />
}
