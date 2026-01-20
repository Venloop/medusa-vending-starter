/**
 * Mapping locale codes to Medusa country codes
 * This is used to map next-intl locale codes (like 'en') to actual country codes in Medusa (like 'gb')
 */
const LOCALE_TO_COUNTRY_MAP: Record<string, string> = {
  en: "gb", // English locale maps to Great Britain country code
  pl: "pl", // Polish locale maps to Poland country code
}

/**
 * Convert locale to country code for Medusa API calls
 * @param locale - The locale (e.g., 'en', 'pl')
 * @returns The corresponding country code (e.g., 'gb', 'pl')
 */
export function getCountryCodeForLocale(locale: string): string {
  return LOCALE_TO_COUNTRY_MAP[locale.toLowerCase()] || locale.toLowerCase()
}

/**
 * Convert country code to locale for URL generation
 * @param countryCode - The country code (e.g., 'gb', 'pl')
 * @returns The corresponding locale (e.g., 'en', 'pl')
 */
export function getLocaleForCountryCode(countryCode: string): string {
  const normalizedCountryCode = countryCode.toLowerCase()
  // Find the locale key where the value matches the country code
  const locale = Object.entries(LOCALE_TO_COUNTRY_MAP).find(
    ([_, country]) => country === normalizedCountryCode
  )?.[0]
  
  return locale || normalizedCountryCode
}

/**
 * Check if a given code is a supported locale
 */
export function isSupportedLocale(code: string): boolean {
  return Object.keys(LOCALE_TO_COUNTRY_MAP).includes(code.toLowerCase())
}

export const SUPPORTED_LOCALES = Object.keys(LOCALE_TO_COUNTRY_MAP)
