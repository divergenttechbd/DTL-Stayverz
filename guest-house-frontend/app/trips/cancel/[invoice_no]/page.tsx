import React from 'react'
import TripCancel from '~/app/trips/components/TripCancel'

const HomePage = ({ params }: { params: { invoice_no: string } }) => {
  return (
    <div className='relative py-5'>
      <div className='md:space-y-10'>
        <TripCancel params={params}/>
      </div>
    </div>
  )
}

export default HomePage


