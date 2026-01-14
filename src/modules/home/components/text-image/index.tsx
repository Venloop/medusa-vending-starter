import { Github } from "@medusajs/icons"
import { Button, Heading } from "@medusajs/ui"
import Link from "next/link"
import { getTranslations } from "next-intl/server"

const TextImage = async () => {
  const t = await getTranslations("Home.textImage")

  return (
    <div className="w-full border-b border-ui-border-base relative bg-ui-bg-subtle">
      <div className="content-container py-12 small:py-12 max-w-3.125 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 small:gap-12 gap-4 items-center">
                    <div>
            <img
              src="/images/store-hero.png"
              alt={t("altImage")}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <Heading
              level="h2"
              className="small:text-3xl text-2xl leading-tight text-ui-fg-base font-normal small:mb-4 mb-4"
            >
              {t("title")}
            </Heading>
            <div className="text-ui-fg-base text-sm [&>p]:mb-4">
              <p>
                {t("paragraph1")}
              </p>
              <p>
                {t("paragraph2")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TextImage
