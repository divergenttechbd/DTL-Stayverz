'use client'
import { useSearchParams } from 'next/navigation'
import { FC, useMemo } from 'react'
import ReservationTable from '~/app/host-dashboard/reservations/components/ReservationTable'
import ReservationTabs from '~/app/host-dashboard/reservations/components/ReservationTabs'
import { useTabs } from '~/hooks/tabs/useTabs'
import { getObjectFromSearchParams } from '~/lib/utils/url'

const Reservation:FC = () => {

  const searchParams = useSearchParams()
  const eventType = useMemo(()=>{
    const updatedSearchParams =  getObjectFromSearchParams(searchParams)
    //If there is no event-type then it will be 'all'
    if(Object.keys(updatedSearchParams).length === 0){
      return 'all'
    }
    return updatedSearchParams.event_type

  },[searchParams])
  const { activeTab,handleChange } = useTabs({initialActiveTab:eventType})

  return (
    <div className='w-[95%] mx-auto my-5 sm:my-10'>
      <h2 className='text-2xl font-medium sm:font-regular sm:text-3xl'>Reservations</h2>
      <ReservationTabs activeTab={activeTab} onChange={handleChange} />
      <ReservationTable eventType={eventType}/>
    </div>
  )
}

export default Reservation
