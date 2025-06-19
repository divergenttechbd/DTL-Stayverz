'use client'
import { CaretLeft } from '@phosphor-icons/react'
import { useMutation } from '@tanstack/react-query'
import dayjs from 'dayjs'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import BookingCard from '~/app/checkout/components/BookingCard'
import EditableItem from '~/app/checkout/components/EditableItem'
import DateRangeModal from '~/app/checkout/components/guestDropdown/DateRangeModal'
import GuestModal from '~/app/checkout/components/guestDropdown/GuestModal'
import { GuestCounts } from '~/app/rooms/components/guestDropdown/GuestDropDown'
import { DateRange } from '~/components/form/inputs/DateRangeInput/DateRangeInput'
import Button from '~/components/layout/Button'
import { DATE_FORMAT } from '~/constants/format'
import { rangeFormatter } from '~/lib/utils/formatter/dateFormatter'
import { getAsQueryString } from '~/lib/utils/url'
import { createBooking, createPayment } from '~/queries/client/bookings'
import { useAuthStore } from '~/store/authStore'
import { styles } from '~/styles/classes'


export type DateRangeTypes = {
  inSelectedRange: Function
  isPrevious: Function
  isSelecting: boolean
  handleMouseClick: Function
  handleMouseEnter: Function
  selectedRange: DateRange
  resetSelected: Function
  generateDataByMonth: Function
}


export type RoomDateRangeProps = {
  dateRangeDefaultValue?: DateRange,
  handleChange: (value: DateRange) => void
}

export const getStayingDuration = (value: DateRange) => {

  const startDate = dayjs(value.startDate)
  const endDate = dayjs(value.endDate)

  const nights = endDate.diff(startDate, 'day')

  return {
    totalNights: nights > 0 ? nights : 0,
    arrivalDate: startDate.isValid() ? startDate.format('MMM D, YYYY') : 'Arrival Date',
    leavingDate: endDate.isValid() ? endDate.format('MMM D, YYYY') : 'Leaving Date'
  }
}


const RoomDetails: React.FC<any> = ({ data }) => {
  const [showGuestModal, setShowGuestModal] = useState(false)
  const [showDateRangeModal, setShowDateRangeModal] = useState(false)
  const [selectedRange, setSelectedRange] = useState<DateRange>()
  const [guests, setGuests] = useState<GuestCounts>({ adult: 1, children: 0, infant: 0, pets: 0 })
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isAgreed, setIsAgreed] = useState(false)

  const { isAuthenticated, userData } = useAuthStore()

  const router = useRouter()
  const searchParams = useSearchParams()

  const minimumNightsSelected = useMemo(
    () => selectedRange?.startDate && selectedRange?.endDate?.diff(selectedRange.startDate, 'day')! >= data?.minimum_nights,
    [selectedRange, data])

  const { mutateAsync: createBookingAsync, isLoading: isBookingLoading } = useMutation({
    mutationFn: createBooking
  })
  const { mutateAsync: createPaymentAsync, isLoading: isPaymentLoading } = useMutation({
    mutationFn: createPayment,
  })

  const handleBookingCreate = useCallback(async () => {
    const payload = {
      listing: data?.id,
      check_in: selectedRange?.startDate?.format(DATE_FORMAT),
      check_out: selectedRange?.endDate?.format(DATE_FORMAT),
      children_count: guests.children,
      adult_count: guests.adult,
      infant_count: guests.infant
    }

    try {
      const mutation = await createBookingAsync({ data: payload })
      if (!mutation.isSucceed) throw mutation
      const bookingMutation = await createPaymentAsync({ data: { booking: mutation.data.invoice_no } })
      if (!bookingMutation.isSucceed) throw bookingMutation
      setIsLoggingIn(false)
      window.location.replace(bookingMutation.data.payment_gateway_url)
      return bookingMutation
    } catch (error) {
      setIsLoggingIn(false)
      return error
    }
  }, [data?.id, selectedRange, guests, createBookingAsync, createPaymentAsync])

  useEffect(() => {
    if (searchParams.has('check_in') && searchParams.has('check_out')) {
      setSelectedRange({ startDate: dayjs(searchParams.get('check_in')), endDate: dayjs(searchParams.get('check_out')) })
    }
    if (searchParams.has('adult')) {
      setGuests({
        adult: parseInt(searchParams.get('adult') || '0'),
        children: parseInt(searchParams.get('children') || '0'),
        infant: parseInt(searchParams.get('infant') || '0'),
        pets: 0
      })
    }
  }, [searchParams])

  useEffect(() => {
    if (isLoggingIn && userData?.u_type === 'guest')
      handleBookingCreate()
  }, [handleBookingCreate, isLoggingIn, userData])

  const onClose = useCallback(() => {
    setShowDateRangeModal(false)
    setShowGuestModal(false)
  }, [])

  const handleBack = useCallback(() => {
    router.push(`/rooms/${data.unique_id}${getAsQueryString({
      ...guests,
      check_in: selectedRange?.startDate?.format(DATE_FORMAT),
      check_out: selectedRange?.endDate?.format(DATE_FORMAT)
    })
    }`)
  }, [data, guests, router, selectedRange])


  const handleDateRangeModalOpen = useCallback(() => {
    setShowDateRangeModal(true)
  }, [])

  const handleGuestModalOpen = useCallback(() => {
    setShowGuestModal(true)
  }, [])

  const handleLogin = useCallback(() => {
    setIsLoggingIn(true)
    useAuthStore.setState({ authFlow: 'GUEST_LOG_IN' })
  }, [])


  return (
    <div className='mx-auto flex flex-col sm:flex-row gap-10 sm:gap-20'>
      {selectedRange &&
        <div className='flex-1'>
          <div className='sm:mt-7 mb-10 sm:mb-16 flex justify-start items-center gap-3'>
            <div className={`${styles.flexCenter} p-0`}>
              <CaretLeft
                className='cursor-pointer pl-0 -ml-1'
                onClick={handleBack}
                size={25}
              />
            </div>
            <div>
              <h1 className='text-3xl font-medium text-[#202020]'>Confirm and pay</h1>
            </div>
          </div>
          <h1 className='text-xl font-medium text-[#202020] mb-10 sm:mb-16'>Your trip</h1>
          <EditableItem title='Dates' sub_title={`${rangeFormatter(selectedRange?.startDate, selectedRange?.endDate)} `} onClick={handleDateRangeModalOpen} />
          <hr className='my-5 sm:my-10' />
          <EditableItem title='Guests' sub_title={`${guests.children + guests.adult} ${(guests.children + guests.adult) <= 1 ? 'guest' : 'guests'} ${guests.infant ? `, ${guests.infant}  ${guests.infant <= 1 ? 'infant': 'infants'}` : ''}`} onClick={handleGuestModalOpen} />
          <GuestModal showModal={showGuestModal} maxGuests={data?.guest_count} onClose={onClose} defaultValue={guests} />
          <DateRangeModal showModal={showDateRangeModal} onClose={onClose} data={data} defaultValue={selectedRange} />
          <hr className='my-10' />
          <div className='flex justify-between'>
            <h1 className='text-xl font-medium'>Pay with</h1>
            <Image src='/sslcommerz.png' width={100} height={16} alt='SSL Commerz' />
          </div>

          <hr className='my-10' />

          <h1 className='text-xl font-medium'>Cancellation policy</h1>
          <p className='my-3'>{data?.cancellation_policy?.description}</p>

          <hr className='my-10' />

          <h1 className='text-xl font-medium'>Ground rules</h1>
          <p className='my-3 font-medium'>We ask every guest to remember a few simple things about what makes a great guest.

          </p>
          <ul className='list-disc ml-5 font-medium'>
            <li>Follow the house rules</li>
            <li>Treat your Host&apos;s home like your own</li>
          </ul>

          <hr className='my-10' />

          <div className='flex items-center'>
            <input
              type='checkbox'
              id='agreement'
              checked={isAgreed}
              onChange={(e) => setIsAgreed(e.target.checked)}
              className='mr-2 accent-brandColor'
            />
            <p className='text-xs'>By selecting the button below, I agree to 
            the <a className='underline font-semibold cursor-pointer' href='/terms-and-conditions'>Terms & Conditions</a> and  
            <a className='underline font-semibold cursor-pointer' href='/refund-policy'>{' '}Refund Policy.</a>
            </p>
          </div>

          <Button
            label='Confirm and Pay'
            loadingText='Confirm and Pay'
            onclick={isAuthenticated && userData?.u_type === 'guest' ? handleBookingCreate : handleLogin}
            loading={isBookingLoading || isPaymentLoading}
            disabled={!minimumNightsSelected && !isAgreed}
            className={`px-4 py-2 rounded-lg !w-[200px] ${
              isAgreed
                ? 'bg-brandColor text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          />
        </div>}
      <div className='flex-[0.8] relative'>
        <BookingCard
          selectedRange={selectedRange}
          data={data}
        />
      </div>
    </div>
  )
}

export default RoomDetails
