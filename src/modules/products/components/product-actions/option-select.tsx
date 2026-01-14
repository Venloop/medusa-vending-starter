import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import { useTranslations } from "next-intl"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const t = useTranslations()
  const filteredOptions = (option.values ?? []).map((v) => v.value)

  const getTranslation = (key: string) => {
    const translation = t(key as any)
    return translation === key ? key : translation
  }

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-sm">
        {t("Select")} {getTranslation(title)}
      </span>
      <div
        className="flex flex-wrap justify-between gap-2"
        data-testid={dataTestId}
      >
        {filteredOptions.map((v) => {
          return (
            <button
              onClick={() => updateOption(option.id, v)}
              key={v}
              className={clx(
                "border-ui-border-base bg-ui-bg-subtle border-2 text-small-regular h-10 rounded-rounded p-2 flex-1 ",
                {
                  "border-[#F7B93E] bg-[#FDF6EF]": v === current,
                  "hover:shadow-elevation-card-rest transition-shadow ease-in-out duration-150":
                    v !== current,
                }
              )}
              disabled={disabled}
              data-testid="option-button"
            >
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
