import { FC } from 'react'
import PriceBreakDown from '~/app/host-dashboard/reservations/components/reservationDetails/PriceBreakDown'
import { ICalendarInfo, IPriceInfo } from '~/app/host-dashboard/reservations/types'

interface IPayout {
  calendar_info: ICalendarInfo[]
  night_count: number
  price: number
  price_info: IPriceInfo
  service_charge: number
  payout: number
  userType: string
}
const Payout:FC<IPayout> = ({ 
  calendar_info, night_count, price, price_info, service_charge, payout, userType 
}) => {
  return (
    <div className='border-b-8 border-grayBorder px-6 pb-6 pt-6'>
      <h3 className='text-2xl mb-2 font-semibold'>{userType} Payment</h3>
      <div className='flex flex-col'>
        <div className='flex justify-between'>
          <p>৳{calendar_info?.[0]?.price} x {night_count} nights</p>
          <p>৳{price}</p>
        </div>
        <PriceBreakDown priceInfo={price_info}/>
        <div className='flex justify-between mt-2'>
          <p>{userType} {userType === 'Guest'? 'Gateway Fee': 'Service Fee'}</p>
          <p>৳{service_charge}</p>
        </div>
        <div className='flex justify-between mt-2'>
          <p className='mt-2 font-semibold'>Total</p>
          <p className='mt-2 font-semibold'>৳{payout}</p>
        </div>
      </div>
    </div>
  )
}

export default Payout
