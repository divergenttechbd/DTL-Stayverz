import React from 'react'
import TripDetails from '~/app/trips/components/TripDetails'


const HomePage = ({ params }: { params: { invoice_no: string } }) => {
  return (
    <div className='relative py-5'>
      <div className='space-y-10'>
        <TripDetails params={params}/>
      </div>
    </div>
  )
}

export default HomePage


