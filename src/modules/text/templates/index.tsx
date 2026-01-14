"use client"

import { Content } from "@modules/common/components/content"
import Section from "@modules/common/sections/section"
import React from "react"

const TextTemplate = ({ textContent }: { textContent: React.ReactNode | string }) => {
  return (
    <Section spacingTop="alt" spacingBottom="alt">
      <Content>
        {textContent}
      </Content>      
    </Section>
  )
}

export default TextTemplate
