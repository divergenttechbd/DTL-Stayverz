'use client'

import { CaretLeft } from '@phosphor-icons/react/dist/ssr/CaretLeft'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import BookingCard from '~/app/rooms/components/BookingCard'
import { GuestCounts } from '~/app/rooms/components/guestDropdown/GuestDropDown'
import { useBookingCard } from '~/app/rooms/components/hooks/useBookingCard'
import ReserveMobile from '~/app/rooms/components/ReserveMobile'
import { useMessageFormMeta } from '~/app/rooms/contact-host/hooks/meta'
import Form from '~/components/form/Form'
import { DateRange } from '~/components/form/inputs/DateRangeInput/DateRangeInput'
import Button from '~/components/layout/Button'
import { UserAvatar } from '~/components/layout/UserAvatar'
import { useModal } from '~/components/modal/hooks/useModal'
import useCalendar from '~/hooks/calendar/useCalendar'
import { getRoomDetailsFew } from '~/queries/client/room'

import { CheckCircle } from '@phosphor-icons/react/dist/ssr/CheckCircle'
import { X } from '@phosphor-icons/react/dist/ssr/X'
import { XCircle } from '@phosphor-icons/react/dist/ssr/XCircle'
import Loader from '~/components/loader/Loader'
import useWindowSize from '~/hooks/useWindowSize'
import customToast from '~/lib/utils/customToast'
import { formatDate } from '~/lib/utils/formatter/dateFormatter'
import { createConversation } from '~/queries/client/conversation'
import { styles } from '~/styles/classes'

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

  // Modal related state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<any>(null)

  useEffect(() => {
    if (searchParams.has('check_in') && searchParams.has('check_out')) {
      setSelectedRange({ startDate: dayjs(searchParams.get('check_in')), endDate: dayjs(searchParams.get('check_out')) })
    }
  }, [searchParams, setSelectedRange])

  const handleBackToRoomDetails = useCallback(() => {
    router.push(`/rooms/${roomId}`)
  },[router , roomId])

  // first submission from contact host
  const handleInitialSubmit = useCallback((data: any) => {
    if (!handleValidate()) {
      if (isMobileView) handleModalOpen()
      return
    }
    setFormData(data)
    setIsModalOpen(true)
  }, [handleValidate, isMobileView, handleModalOpen])

  const handleFinalSubmit = useCallback(async () => {
    if (!formData) return

    console.log('formdata',formData)
    try {
      const response = await createConversation({
        data: {
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
          message: formData.message
        }
      })

      if (response.isSucceed) {
        router.push(`/messages?conversation_id=${response.data.chat_room_id}&signal_peer=inquiry`)
      } else {
        customToast('error', response.error)
      }
    } catch (e: any) {
      console.log(e)
      customToast('error', e.error)
    }
  }, [id, host, bookingData, router, formData])
  
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
                  onSubmit={handleInitialSubmit}
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

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFinalSubmit}
        />
      </>
    ) : null
}

export default ContactHost


/**
 * todo: Use Modal Component
 */
// Confirmation Modal 
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const ConfirmationModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [isAgreed, setIsAgreed] = useState(false)

  console.log('got the confirmation modal-----')
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = () => {
    if (isAgreed) {
      onSubmit()
      onClose()
    }
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center'>
      <div className='bg-white md:rounded-lg w-full md:max-w-md slide-in-bottom h-full md:h-auto'>
        <div data-component='modal-header' className='flex items-center gap-2 mb-4 py-4 px-5 border-b-grayBorder border'>
          <button onClick={onClose} className='mr-2'>
            <X size={18}/>
          </button>
          <h2 className='text-base font-semibold'>Guidelines for Contacting Hosts</h2>
        </div>
        <div data-component='guide-rules' className='px-5'>
          <ul className='list-none'>
            <li className='mb-4 flex gap-2'>
              <CheckCircle size={16} weight='fill' color='#FC8E6A' className='flex-none mt-[3px]'/>
              <p className='text-sm'><b>Keep all communications within the platform:</b><br></br>
              Use our messaging system to communicate with hosts at all times.</p>
            </li>
            <li className='mb-4 flex gap-2'>
              <CheckCircle size={16} weight='fill' color='#FC8E6A' className='flex-none mt-[3px]'/>
              <p className='text-sm'><b>Ask relevant questions:</b><br></br>
              Focus on questions related to the property, amenities, booking details, and local tips.</p>
            </li>
            <li className='mb-4 flex gap-2'>
              <CheckCircle size={16} weight='fill' color='#FC8E6A' className='flex-none mt-[3px]'/>
              <p className='text-sm'><b>Be respectful:</b><br></br>
              Always maintain a polite and professional tone when messaging hosts.</p>
            </li>
            <li className='mb-4 flex gap-2'>
              <XCircle size={16} weight='fill' color='#FC8E6A' className='flex-none mt-[3px]'/>
              <p className='text-sm'><b>Don’t request personal information:</b><br></br>
              Avoid asking hosts for their phone number, email, or any personal contact details.</p>
            </li>
            <li className='mb-4 flex gap-2'>
              <XCircle size={16} weight='fill' color='#FC8E6A' className='flex-none mt-[3px]'/>
              <p className='text-sm'><b>Don’t offer external communication:</b><br></br>
              All arrangements and discussions should be made on the platform until your booking is confirmed.</p>
            </li>
            <li className='mb-4 flex gap-2'>
              <XCircle size={16} weight='fill' color='#FC8E6A' className='flex-none mt-[3px]'/>
              <p className='text-sm'><b>Don’t make inappropriate requests:</b><br></br>
              Requests unrelated to the stay or that violate platform policies are not allowed.</p>
            </li>
          </ul>
        </div>
        <div data-componet='modal-footer' className='flex flex-col gap-5 mt-4 md:mb-4 px-5 self-end absolute bottom-5 w-full md:relative md:bottom-auto'>
          <div className='flex items-center'>
            <input
              type='checkbox'
              id='agreement'
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)}
              className='mr-2 accent-brandColor'
            />
            <label htmlFor='agreement'>I agree to the terms.</label>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!isAgreed}
            className={`px-4 py-2 rounded-lg w-full ${
              isAgreed
                ? 'bg-brandColor text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Send Message
          </button>
        </div>
      </div>
    </div>
  )
}
