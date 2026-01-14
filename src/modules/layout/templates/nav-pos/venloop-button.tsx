'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@medusajs/ui'

export default function PosDeviceButton() {
  const params = useParams()
  const handle = params.handle as string | undefined

  return (
    <>
      {handle && (
        <div className="flex flex-col space-y-4 items-center">
          <Link href={`/pos/locations/${handle}/store/buy`}>
            <Button variant="primary" size="small" className="w-full">Otwórz urządzenie POS</Button>
          </Link>
        </div>        
      )}
    </>
  )
} 