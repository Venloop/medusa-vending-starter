'use client'

import { useParams } from 'next/navigation'
import { Button } from '@medusajs/ui'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import { useTranslations } from 'next-intl'

export default function PosDeviceButton() {
  const t = useTranslations()
  const params = useParams()
  const handle = params.handle as string | undefined

  return (
    <>
      {handle && (
        <div className="flex flex-col space-y-4 items-center">
          <LocalizedClientLink href={`/pos/locations/${handle}/store/buy`}>
            <Button variant="primary" size="small" className="w-full">{t("LocationInfo.openDevice")}</Button>
          </LocalizedClientLink>
        </div>        
      )}
    </>
  )
} 