import { FC } from 'react'

interface IBookingDetails {
  adult_count: number
  checkInWithYear: string
  checkOutWithYear: string
  bookingWithYear: string
  reservation_code: string
  children_count: number
  infant_count: number
}

const BookingDetails:FC<IBookingDetails> = ({ adult_count, children_count, infant_count, checkInWithYear, checkOutWithYear, bookingWithYear, reservation_code }) => {
  const guestCounts = [
    {
      type: adult_count > 1 ? 'adults' : 'adult',
      count: adult_count,
    },
    {
      type: children_count > 1 ? 'children' : 'child',
      count: children_count,
    },
    {
      type: infant_count > 1 ? 'infants' : 'infant',
      count: infant_count,
    },
  ].filter((data) => data.count)
  
  return (
    <div className='border-b-8 border-grayBorder px-6 pb-6 pt-8'>
      <h3 className='text-[22px] font-semibold pb-4'>Booking Details</h3>
      <div className='flex flex-col gap-1 border-b border-grayBorder py-6'>
        <p className='font-medium'>Guests</p>
        <p className='text-grayText text-sm'>
          {guestCounts.map((d) => `${d.count} ${d.type}`).join(', ')}
        </p>
      </div>
      <div className='flex flex-col gap-1 border-b border-grayBorder py-6'>
        <p className='font-medium'>Check-in</p>
        <p className='text-grayText text-sm'>{checkInWithYear}</p>
      </div>
      <div className='flex flex-col gap-1 border-b border-grayBorder py-6'>
        <p className='font-medium'>Check-out</p>
        <p className='text-grayText text-sm'>{checkOutWithYear}</p>
      </div>
      <div className='flex flex-col gap-1 border-b border-grayBorder py-6'>
        <p className='font-medium'>Booking date</p>
        <p className='text-grayText text-sm'>{bookingWithYear}</p>
      </div>
      <div className='flex flex-col gap-1 border-b border-grayBorder py-6'>
        <p className='font-medium'>Confirmation Code</p>
        <p className='text-grayText text-sm'>{reservation_code}</p>
      </div>
    </div>
  )
}

export default BookingDetails
