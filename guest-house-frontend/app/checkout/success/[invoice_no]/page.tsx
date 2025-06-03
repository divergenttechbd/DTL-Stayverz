import React from 'react'
import BookingResultDetails from '~/app/checkout/components/BookingResultDetails'

const Success = ({ params }: { params: { invoice_no: string } }) => {
  return (
    <BookingResultDetails params={params} />
  )
}

export default Success
