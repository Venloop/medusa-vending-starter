"use client"

import ListPaymentsMethods from "@modules/payments/components/list-payments-methods"
import AddPaymentForm from "@modules/payments/components/add-payment-form"

const CartsBook = () => {
  return (
    <>
      <ListPaymentsMethods />
      <AddPaymentForm />
    </>
  )
}

export default CartsBook
