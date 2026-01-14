"use client"

import { Text, Table, Button, toast } from "@medusajs/ui"
import { capitalize } from "lodash"
import { usePayments } from "@lib/providers/payments"
import { Heading } from "@modules/common/components/heading"
import { useTranslations } from "next-intl"
import { paymentDetachCard } from "@lib/data/pos"

export default function ListPaymentsMethods() {  
  const { refreshPaymentHolders, paymentHolders, isLoadingPaymenHolders } = usePayments()
  const t = useTranslations("Payments")

  const handleDetachCard = async (payment_method_id: string) => {
    try {
      await paymentDetachCard({ payment_method_id: payment_method_id })
      await refreshPaymentHolders()
      
      toast.success("Success", {
        description: t("cardDetached"),
      })
    } catch (error) {
      toast.error("Error", {
        description: t("errorDetachingCard"),
      })
    }
  }

  return (
    <div className="mb-8">
      <Heading gendre="t4" className="text-grey-60 mb-4">{t("listPaymentMethods")}</Heading>

      {(paymentHolders && paymentHolders.length === 0 && !isLoadingPaymenHolders) && <Text className="text-base text-grey-60">
          {t("noPaymentMethods")}
      </Text>}

      {(isLoadingPaymenHolders) && <Text className="text-base text-grey-60">
        {t("loadingPaymentMethods")}
      </Text>}

      {paymentHolders && paymentHolders.length > 0 && <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>{t("cardType")}</Table.HeaderCell>
            <Table.HeaderCell>{t("cardNumber")}</Table.HeaderCell>
            <Table.HeaderCell>{t("expiryDate")}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {paymentHolders.length > 0 && paymentHolders?.map((holder: any) =>
            holder.payment_methods.map((method: any) => (
              <Table.Row key={method.id}>
                <Table.Cell>
                  <Text className="txt-medium text-ui-fg-base">
                    {capitalize(method.data.card.brand)}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text className="txt-medium text-ui-fg-base">
                    •••• {method.data.card.last4}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text className="txt-medium text-ui-fg-subtle">
                    {method.data.card.exp_month}/{method.data.card.exp_year}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Button variant="primary" size="small" onClick={() => handleDetachCard(method.id)}>
                    {t("detachCard")}
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
      }
    </div>
  )
}
