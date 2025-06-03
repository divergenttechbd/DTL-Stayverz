'use client'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { getRoomDetailsFew } from '~/queries/client/room'
import { UserAvatar } from '~/components/layout/UserAvatar'
import Form, { IFormProps } from '~/components/form/Form'
import Button from '~/components/layout/Button'
import { useCallback, useState, useEffect } from 'react'
import { useMessageFormMeta } from '~/app/rooms/contact-host/hooks/meta'
import BookingCard from '~/app/rooms/components/BookingCard'
import useCalendar from '~/hooks/calendar/useCalendar'
import { createConversation } from '~/queries/client/conversation'
import { GuestCounts } from '~/app/rooms/components/guestDropdown/GuestDropDown'
import { DateRange } from '~/components/form/inputs/DateRangeInput/DateRangeInput'
import customToast from '~/lib/utils/customToast'
import { useBookingCard } from '~/app/rooms/components/hooks/useBookingCard'
import { formatDate } from '~/lib/utils/formatter/dateFormatter'
import { CaretLeft } from '@phosphor-icons/react/dist/ssr/CaretLeft'
import ReserveMobile from '~/app/rooms/components/ReserveMobile'
import dayjs from 'dayjs'
import { useModal } from '~/components/modal/hooks/useModal'

import { styles } from '~/styles/classes'
import Loader from '~/components/loader/Loader'
import useWindowSize from '~/hooks/useWindowSize'

const ContactHost = () => {
  const {isMobileView} = useWindowSize()
  const router = useRouter()
  const { unique_id: roomId } = useParams()
  const [isOpen, handleModalOpen, handleModalClose,] = useModal()
  const { data, error, isLoading } = useQuery({ queryKey: ['room-details', roomId], queryFn: () => getRoomDetailsFew({ params: { unique_id: roomId } }) })
  const { id, host } = data?.data || {}
  const formInstance = useForm()
  const meta = useMessageFormMeta()
  const { selectedRange, setSelectedRange,isSelecting, isPrevious, resetSelected, handleMouseEnter, inSelectedRange, generateDataByMonth, handleMouseClick } = useCalendar()
  const [bookingData, setBookingData] = useState<{guests: GuestCounts; selectedRange: DateRange}>()
  const [bookingCardError, handleValidate, minimumNightsSelected, hasDateRangeSelected] = useBookingCard(selectedRange, data?.data)
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.has('check_in') && searchParams.has('check_out')) {
      setSelectedRange({ startDate: dayjs(searchParams.get('check_in')), endDate: dayjs(searchParams.get('check_out')) })
    }
  }, [searchParams, setSelectedRange])

  const handleBackToRoomDetails = useCallback(() => {
    router.push(`/rooms/${roomId}`)
  },[router , roomId])

  
  const handleSubmitMessage:IFormProps['onSubmit'] = useCallback(async (data) => {
    if (!handleValidate()) {
      if(isMobileView)  handleModalOpen()
      return
    }
    const response = await createConversation({data: {
      listing: id,
      to_user: host?.id,
      booking_data: {
        check_in: formatDate(bookingData?.selectedRange.startDate!),
        check_out: formatDate(bookingData?.selectedRange.endDate!),
        adult: bookingData?.guests?.adult,
        children: bookingData?.guests?.children,
        infant: bookingData?.guests?.infant,
        pets: bookingData?.guests?.pets,
        total_guest_count: (bookingData?.guests?.adult || 0) + (bookingData?.guests?.children || 0) + (bookingData?.guests?.infant || 0) + (bookingData?.guests?.pets || 0),
      },
      message: data.message
    }}).catch(e => {
      console.log (e)
      customToast('error', e.error)
      throw e
    })

    if (response.isSucceed) {
      router.push(`/messages?conversation_id=${response.data.chat_room_id}&signal_peer=inquiry`)
      handleValidate()
    } else {
      customToast('error', response.error)
    }
    return response
  }, [handleValidate, id, host, bookingData, router,handleModalOpen,isMobileView])
  
  if (error) return 'Something went wrong!'

  return isLoading ? 
    <div className={`h-screen w-full ${styles.flexCenter}`}>
      <Loader/>
    </div> : 
    (data && host) ? (
      <>   
        <div className='container'>
          <div className='flex flex-col sm:flex-row py-5 gap-10 '>
            <div className='flex flex-col basis-2/3 '>
              <div className='flex basis-full justify-between items-center border-b pb-8 sm:my-4'>
                <div className='flex justify-start items-start gap-1'>
                  <button onClick={handleBackToRoomDetails} className='pt-1 block sm:hidden'>
                    <CaretLeft size={20} fill='#222222'/>
                  </button>
                  <div>
                    <h4 className='font-semibold text-xl'>Contact {host?.full_name}</h4>
                    <p className='text-gray-500'>Typically responds as early as possible</p>
                  </div>
                </div>
                <div >
                  <UserAvatar image={host?.image} fullName={host?.full_name} />
                </div>
              </div>
              <div className='my-4'>
                <h4 className='font-semibold text-xl mb-5'>Still have questions? Message the Host</h4>
                <Form
                  fields={meta}
                  formInstance={formInstance}
                  onSubmit={handleSubmitMessage}
                  submitButtonLabel={<Button label='Send message' type='submit' variant='outlined' className='mr-auto' />}
                  resetForm={false}
                />
              </div>
            </div>
            <div className='hidden sm:flex flex-col basis-1/3'>
              <BookingCard
                className='w-full'
                selectedRange={selectedRange}
                setSelectedRange={setSelectedRange}
                isSelecting={isSelecting}
                isPrevious={isPrevious}
                resetSelected={resetSelected}
                handleMouseEnter={handleMouseEnter}
                inSelectedRange={inSelectedRange}
                generateDataByMonth={generateDataByMonth}
                handleMouseClick={handleMouseClick}
                data={data.data}
                onChange={setBookingData}
                error={!minimumNightsSelected || !hasDateRangeSelected ? bookingCardError : undefined}
                onValidate={handleValidate}
              />
            </div>
          </div>
        </div>
    
        {/* =========== RESERVE MOBILE =========== */}
        <ReserveMobile
          className='w-full'
          selectedRange={selectedRange}
          setSelectedRange={setSelectedRange}
          isSelecting={isSelecting}
          isPrevious={isPrevious}
          resetSelected={resetSelected}
          handleMouseEnter={handleMouseEnter}
          inSelectedRange={inSelectedRange}
          generateDataByMonth={generateDataByMonth}
          handleMouseClick={handleMouseClick}
          data={data.data}
          onChange={setBookingData}
          error={!minimumNightsSelected || !hasDateRangeSelected ? bookingCardError : undefined}
          onValidate={handleValidate}
          isOpen={isOpen}
          handleModalOpen={handleModalOpen}
          handleModalClose={handleModalClose}
        />
      </>
 
    ) : null
}

export default ContactHost
