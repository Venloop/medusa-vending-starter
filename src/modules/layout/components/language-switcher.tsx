"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "../../../i18n/navigation"
import { useState, useTransition } from "react"

const LANGUAGES = [
  { code: "pl", label: "PL" },
  { code: "en", label: "EN" },
]

export default function LanguageSwitcher() {
  const currentLocale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const currentLanguage = LANGUAGES.find((lang) => lang.code === currentLocale)

  const handleLanguageChange = (newLocale: string) => {
    // Remove current locale from pathname to get the base path
    // pathname from usePathname() includes locale (e.g., "/en" or "/en/store")
    let pathWithoutLocale = pathname
    
    // If pathname starts with current locale, remove it
    if (pathname === `/${currentLocale}` || pathname.startsWith(`/${currentLocale}/`)) {
      pathWithoutLocale = pathname.slice(`/${currentLocale}`.length) || "/"
    }
    
    startTransition(() => {
      router.push(pathWithoutLocale, { locale: newLocale })
      // Force a full refresh to re-render all Server Components with new locale
      router.refresh()

      setIsOpen(false)
    })
  }

  return (
    <div className="relative h-full mr-4 flex items-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 h-full px-3 text-white font-bold text-base hover:opacity-80 transition-opacity"
        disabled={isPending}
      >
        <span>{currentLanguage?.label}</span>
        <svg
          className={`w-3.5 h-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-16 bg-white rounded-lg shadow-lg z-50 border border-gray-200 overflow-hidden">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full flex items-center gap-2 px-4 py-3 text-sm font-medium hover:text-orange-600 transition-colors ${
                  lang.code === currentLocale ? "text-orange-700" : "text-gray-700"
                }`}
                disabled={isPending}
              >
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
