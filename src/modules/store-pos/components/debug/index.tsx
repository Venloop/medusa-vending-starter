"use client"

import { FirebaseWrapper } from "@lib/firebase/firebase-wrapper"

const Debug = ({ params, searchParams }: { params: any, searchParams: any }) => {
  return (
    <>
      <FirebaseWrapper />
    </>
  )
}

export default Debug