'use client'
import { useQuery, } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import BookingSuccessCard from '~/app/checkout/components/BookingSuccessCard'
import { SignalConfirmation } from '~/app/checkout/components/SignalConfirmation'
import Button from '~/components/layout/Button'
import { getBooking } from '~/queries/client/bookings'

const BookingResultDetails = ({ params }: { params: { invoice_no: string } })  => {
  const { data, refetch, error, isLoading } = useQuery({ queryKey: ['bookingDetails', params.invoice_no], queryFn: () => getBooking({ params: { invoice_no: params.invoice_no, is_review:true } }) })
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [confirmationSignalSent, setConfirmationSignalSent] = useState(false)
  
  const handleMessageHost = useCallback(() => {
    router.push(`/messages?conversation_id=${data?.data?.chat_room}`)
  }, [router, data?.data?.chat_room])

  return (
    <>
      <SignalConfirmation invoiceNo={params.invoice_no} conversationId={data?.data?.chat_room} onSignalSent={setConfirmationSignalSent} />
      <div className='container mx-auto flex flex-col md:flex-row gap-5 md:gap-20'>
        <div className='flex-[1] '>
          <h1 className='text-3xl font-semibold text-[#202020] mt-8'>Your reservation is completed</h1>
          <h3 className='text-xl font-semibold mt-2'>Treat your Host&apos;s home like your own</h3>
          <ul className='list-disc ml-6 mb-3'>
            <li className='mt-1'>
              <span className='font-semibold mt-2'>Cleanliness</span>: Guests should not leave the listing in a state that requires excessive or deep cleaning (moldy dishes, soiled carpets, stains from pets, etc.). Cleaning fees set by Hosts are only meant to cover the cost of standard cleaning between reservations (laundry, vacuuming, etc.).
            </li>
            <li className='mt-1'>
              <span className='font-semibold mt-2'>Litter</span>: Guests should put their trash in designated trash receptacles and be mindful of excessive amounts of trash.
            </li>
            <li className='mt-1'>
              <span className='font-semibold mt-2'>Damage</span>: Where guests cause damage that is beyond normal wear and tear, we expect guests to inform Hosts of the damage as soon as possible and work with the Host to find a reasonable solution. Guests are expected to pay reasonable requests for reimbursement if they’re responsible for damage, missing items, or unexpected cleaning costs.
            </li>
          </ul>
          <Button 
            label='Message Host' 
            onclick={handleMessageHost} 
            loading={!confirmationSignalSent}
            className='!w-[200px] mb-4'
          />
        </div>
        <div className='flex-[0.8] sm:mt-10 relative pb-[50px] sm:pb-0'>
          <BookingSuccessCard data={data?.data?.booking_data} isOpen={isOpen} setIsOpen={setIsOpen}/>
        </div>
      </div>
    </>
  )
}

export default BookingResultDetails
