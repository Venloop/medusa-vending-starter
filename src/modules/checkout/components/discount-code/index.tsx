"use client"

import { Badge, Input, Label, Text } from "@medusajs/ui"
import React from "react"
import { useTranslations } from "next-intl"

import { applyPromotions } from "@lib/data/cart"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import Trash from "@modules/common/icons/trash"
import ErrorMessage from "../error-message"
import { Button } from "@modules/common/components/button"
import ShoppingNote from "@modules/common/icons/shopping"
import { Heading } from "@modules/common/components/heading"
import Spinner from "@modules/common/icons/spinner"

type DiscountCodeProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [removingCode, setRemovingCode] = React.useState<string | null>(null)
  const t = useTranslations()

  const { items = [], promotions = [] } = cart
  const removePromotionCode = async (code: string) => {
    setRemovingCode(code)
    try {
      const validPromotions = promotions.filter(
        (promotion) => promotion.code !== code
      )

      await applyPromotions(
        validPromotions.filter((p) => p.code !== undefined).map((p) => p.code!)
      )
    } finally {
      setRemovingCode(null)
    }
  }

  const addPromotionCode = async (formData: FormData) => {
    const code = formData.get("code")
    if (!code) {
      return
    }

    setIsLoading(true)
    try {
      const input = document.getElementById(
        "promotion-input"
      ) as HTMLInputElement
      const codes = promotions
        .filter((p) => p.code !== undefined)
        .map((p) => p.code!)
      codes.push(code.toString())

      const response = await applyPromotions(codes)

      const appliedPromotions = response?.cart?.promotions || []
      const wasApplied = appliedPromotions.some((p: any) => p.code === code)

      if (!wasApplied) {
        throw new Error(t("Invalid promotion code"))
      }

      if (input) {
        input.value = ""
      }
    } finally {
      setIsLoading(false)
    }
  }

  const [error, setError] = React.useState<string | null>(null)

  return (
    <div className="w-full flex flex-col">
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          setError(null)
          try {
            await addPromotionCode(formData)
          } catch (err: any) {
            setError(err.message || "Failed to apply promotion")
          }
        }}
        className="w-full"
      >
        <Label className="flex gap-x-1 items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="text-base font-bold  flex items-center gap-x-2"
            data-testid="add-discount-button"
          >
            <ShoppingNote />
            {t("AddPromotionCode")}
          </button>
        </Label>

        {isOpen && (
          <>
            <div className="flex w-full gap-x-2 mt-8">
              <div className="flex-grow">
                <Input
                  className="size-full h-12"
                  id="promotion-input"
                  name="code"
                  type="text"
                  autoFocus={false}
                  disabled={isLoading}
                  data-testid="discount-input"
                />
              </div>
              <Button
                variant="outline"
                disabled={isLoading}
                data-testid="discount-apply-button"
                className="flex items-center gap-2 w-[100]"
              >
                {isLoading ? <Spinner /> : t("Apply")}
              </Button>
            </div>

            <ErrorMessage error={error} data-testid="discount-error-message" />
          </>
        )}
      </form>

      {promotions.length > 0 && (
        <div className="w-full flex items-center">
          <div className="flex flex-col w-full">
            <Heading gendre="t6" className="font-medium mt-6">
              {t("Promotion(s) applied:")}
            </Heading>

            {promotions.map((promotion) => {
              return (
                <div
                  key={promotion.id}
                  className="flex items-center justify-between w-full max-w-full mt-2"
                  data-testid="discount-row"
                >
                  <Text className="flex gap-x-1 items-baseline txt-small-plus w-4/5 pr-1">
                    <span className="truncate" data-testid="discount-code">
                      <Badge
                        color={promotion.is_automatic ? "green" : "grey"}
                        size="small"
                      >
                        {promotion.code}
                      </Badge>
                      {promotion.application_method?.value !== undefined &&
                        promotion.application_method.currency_code !==
                          undefined && (
                          <>
                            {" "}
                            (
                            {promotion.application_method.type === "percentage"
                              ? `${promotion.application_method.value}%`
                              : convertToLocale({
                                  amount:
                                    typeof promotion.application_method
                                      .value === "number"
                                      ? promotion.application_method.value
                                      : parseInt(
                                          promotion.application_method.value?.toString() ||
                                            "0"
                                        ),
                                  currency_code:
                                    promotion.application_method.currency_code,
                                })}
                            )
                          </>
                        )}
                    </span>
                  </Text>
                  {!promotion.is_automatic && (
                    <button
                      className="flex items-center gap-2"
                      disabled={removingCode === promotion.code}
                      onClick={() => {
                        if (!promotion.code) {
                          return
                        }

                        removePromotionCode(promotion.code)
                      }}
                      data-testid="remove-discount-button"
                    >
                      {removingCode === promotion.code ? (
                        <Spinner />
                      ) : (
                        <Trash size={14} />
                      )}
                      <span className="sr-only">
                        {t("Remove discount code from order")}
                      </span>
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default DiscountCode
