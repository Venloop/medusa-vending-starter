"use client"

import { ChevronDownMini } from "@medusajs/icons"
import { Text, clx } from "@medusajs/ui"
import { useState, useRef, useEffect } from "react"

type FilterDropdownProps = {
  title: string
  items: {
    value: string
    label: string
  }[]
  value: any
  handleChange: (...args: any[]) => void
  "data-testid"?: string
}

const FilterDropdown = ({
  title,
  items,
  value,
  handleChange,
  "data-testid": dataTestId,
}: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedItem = items.find((item) => item.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSelect = (itemValue: string) => {
    handleChange(itemValue)
    setIsOpen(false)
  }

  return (
    <div className="flex items-center gap-x-4" ref={dropdownRef}>
      <Text className="txt-compact-small-plus text-ui-fg-muted whitespace-nowrap">
        {title}
      </Text>
      <div className="relative flex-1 min-w-[220px]" data-testid={dataTestId}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={clx(
            "w-full px-4 py-2 bg-white border border-black rounded",
            "flex items-center justify-between",
            "txt-compact-small text-left",
            "font-bold font-jost text-base",
            "hover:bg-gray-50 transition-colors"
          )}
        >
          <span>{selectedItem?.label}</span>
          <ChevronDownMini
            className={clx(
              "transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {isOpen && (
          <div
            className={clx(
              "absolute top-full left-0 right-0 mt-1",
              "bg-white border border-black rounded",
              "z-10 shadow-lg"
            )}
          >
            {items.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => handleSelect(item.value)}
                className={clx(
                  "w-full px-3 py-2 txt-compact-small text-left",
                  "hover:bg-gray-100 transition-colors",
                  "first:rounded-t last:rounded-b",
                  "font-jost text-base",
                  item.value === value && "bg-gray-50 font-bold"
                )}
                data-testid={`dropdown-option-${item.value}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default FilterDropdown
