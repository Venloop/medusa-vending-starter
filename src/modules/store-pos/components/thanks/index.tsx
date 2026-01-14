"use client"

import { useTranslations } from "next-intl"
import { Heading } from "@modules/common/components/heading"
import { Content } from "@modules/common/components/content"
import { Button } from "@modules/common/components/button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import IconOnline from "@modules/common/icons/online"

export default function Thanks({
  items,
  title,
  description,
  buttonText,
  buttonTextConfirm,
  location,
}: {
  items: any
  title: string
  description?: string
  buttonText: string
  buttonTextConfirm: string
  location: { id: string }
}) {
  const t = useTranslations("StorePos")

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-screen-sm">
        <Heading
          level="h2"
          gendre="t2"
          className="lg:mb-12 mb-4 text-center text-black"
        >
          {title}
        </Heading>
        {description && (
          <Content className="lg:mb-12 mb-6 text-center text-gray-700">
            {description}
          </Content>
        )}

        <Heading level="h3" gendre="t3" className="mb-4 text-black">
          {t("summary")}
        </Heading>

        <div className="border-t border-gray-200 md:pt-4 pt-2">
          {items.map((item: any) => (
            <dl
              key={item.title}
              className="grid grid-cols-2 gap-2 border-b border-gray-200 md:pb-4 pb-2 md:mb-4 mb-2"
            >
              <dt className="text-sm font-medium">{item.title}</dt>
              <dd className="text-sm text-right font-bold">
                {item.value} {item.currency}
              </dd>
            </dl>
          ))}
        </div>

        <div className="flex justify-center lg:mt-12 mt-6 md:gap-4 gap-2">
          <LocalizedClientLink href="/pos/locations">
            <Button variant="secondary" asChild>
              <div>
                <IconOnline className="w-6 h-6" />
                {buttonText}
              </div>
            </Button>
          </LocalizedClientLink>
          <LocalizedClientLink href={`/pos/locations/${location?.id || ""}`}>
            <Button variant="secondary" asChild>
              <div>
                <IconOnline className="w-6 h-6" />
                {buttonTextConfirm}
              </div>
            </Button>
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
