"use client"

import { Heading } from "@modules/common/components/heading"
import Section from "@modules/common/sections/section"
import LocationName from "../../components/location-name"
import { MainContainer } from "../../templates/main-container"
import Image from "next/image"
import { Content } from "@modules/common/components/content"
import { useState, useCallback } from "react"

interface StepStartProps {
  items: any[]
  title: string
  location: any
  debug: boolean
  region: any
  mode: string
  type: string
  countryCode: string
}

export default function StepStart({
  items,
  title,
  location,
  debug,
  region,
  mode,
  type,
  countryCode,
}: StepStartProps) {
  const [step, setStep] = useState("start")
  
  const onStepChange = useCallback((step: string) => {
    setStep(step)
  }, [])

  return (
    <Section spacingTop="alt" spacingBottom="alt">
      <div className={`mx-auto ${step === "start" ? "max-w-screen-sm" : ""}`}>
        {step === "start" && (
          <LocationName location={location} className="mb-4" />
        )}
        <MainContainer
          onStepChange={onStepChange}
          debug={debug}
          region={region}
          location={location}
          mode={mode}
          type={type}
          countryCode={countryCode}
        />
        {step === "start" && (
          <>
            <div className="grid grid-cols-1 gap-8 my-8">
              {items.map((step, index) => (
                <div key={index} className="flex gap-6">
                  <div className="w-[7.5rem] shrink-0">
                    <Image
                      src={step.image}
                      alt={step.title}
                      width={100}
                      height={100}
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                  <div className="">
                    <Heading level="h2" gendre="t4" className="mb-0">
                      {step.title}
                    </Heading>
                    <Content
                      dangerouslySetInnerHTML={{ __html: step.description }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Section>
  )
}
