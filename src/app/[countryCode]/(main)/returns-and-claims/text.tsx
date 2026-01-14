'use client'

import TextTemplate from "@modules/text/templates"

export default async function TextContent({ countryCode }: { countryCode: string }) {
  const { default: Content } = await import(`@content/returns-and-claims/${countryCode}.mdx`)
  return <TextTemplate textContent={<Content />} />
  
}
