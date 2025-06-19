import { CaretLeft, CaretRight, X } from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react'
import { Transition } from 'react-transition-group'
import EditablePriceInput from '~/app/create-listing/[listing_id]/price/components/EditablePriceInput'
import { Listing } from '~/app/host-dashboard/calendar/components/Calendar'
import useFadeStyles from '~/app/host-dashboard/calendar/hooks/useFadeStyles'
import useTransitionStyles from '~/app/host-dashboard/calendar/hooks/useTransitionStyles'
import ReservationDetails from '~/app/host-dashboard/reservations/components/ReservationDetails'
import Button from '~/components/layout/Button'
import { DATE_FORMAT } from '~/constants/format'
import { DateRange } from '~/hooks/calendar/useCalendar'
import customToast from '~/lib/utils/customToast'
import { rangeFormatter } from '~/lib/utils/formatter/dateFormatter'
import {
  setBookableListingDetails,
  updateListing,
} from '~/queries/client/listing'

type CalendarSidebarProps = {
  selectedRange: DateRange
  resetSelected: Function
  setListing?: Function
  refetchCalendarData: Function
  onBookingSelect: Function
  selectedBooking: string | undefined
  data: {
    calendar_data: any
    listing: {
      base_price: number
      guest_service_charge?: number
      host_service_charge?: number
    }
  }
  listing: Listing | undefined
  closeModal: () => void | React.MouseEventHandler<HTMLButtonElement>
}

export const CalendarAction = ({
  selectedRange,
  resetSelected,
  selectedBooking,
  onBookingSelect,
  data,
  listing,
  setListing,
  closeModal,
}: CalendarSidebarProps) => {
  const [price, setPrice] = useState('0')
  const [blocked, setBlocked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState<string>()
  const [showAddNotes, setShowAddNotes] = useState<boolean>(false)
  const [privateNotes, setPrivateNotes] = useState<string>('')

  const queryClient = useQueryClient()
  const updateListingMutation = useMutation({ mutationFn: updateListing })
  const createDateRangeMutation = useMutation({
    mutationFn: setBookableListingDetails,
  })

  console.log('data', data)
  const handleBlock = useCallback(
    (blocked: boolean) => () => {
      if (!selectedRange.startDate || !selectedRange.endDate) return
      const payload = [
        ...Array(
          selectedRange.endDate.diff(selectedRange?.startDate, 'day') + 1
        ),
      ].map((_, index) =>
        selectedRange.startDate?.add(index, 'day').format(DATE_FORMAT)
      ).map((day: string | undefined) => ({
        ...data.calendar_data[day || ''],
        is_blocked: blocked,
        start_date: day,
        end_date: day,
      }))
      try {
        setLoading(true)
        createDateRangeMutation.mutate(
          { data: { data: payload, id: listing?.id } },
          {
            onSuccess: (res) => {
              if (!res.isSucceed) throw res.data
              setBlocked(blocked)
              customToast(
                'success',
                'Availability Updated',
                'bottom-center',
                'mb-4 sm:m-0'
              )
              queryClient.invalidateQueries({ queryKey: ['calendarData'] })
            },
            onError: (err) => {
              console.log(err)
            },
            onSettled: () => {
              setLoading(false)
            },
          }
        )
      } catch (err) {
        console.log(err)
      }
    },
    [createDateRangeMutation, data, listing?.id, queryClient, selectedRange]
  )

  const handleEditPrice = useCallback((val: string) => () => {
    setEditing(val)
  },[])

  useEffect(() => {
    console.log('inside the useEffect ---')
    if (selectedRange.startDate) {
      setPrice(
        (
          data?.calendar_data[selectedRange.startDate.format(DATE_FORMAT)]
            ?.price || 0
        ).toString()
      )
      setBlocked(
        data?.calendar_data[selectedRange.startDate.format(DATE_FORMAT)]
          ?.is_blocked
      )
      setPrivateNotes(
        data?.calendar_data[selectedRange.startDate.format(DATE_FORMAT)] 
          ?.note
      )
    } else {
      setPrice((data?.listing?.base_price || 0).toString())
    }
  }, [data, selectedRange.startDate])

  const handleNotesSubmit = useCallback(async(event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log('Submitted value:', privateNotes)
    if (!selectedRange.startDate || !selectedRange.endDate) return
    const payload = [
      ...Array(selectedRange.endDate.diff(selectedRange?.startDate, 'day') + 1),
    ].map((_, index) =>
      selectedRange.startDate?.add(index, 'day').format(DATE_FORMAT)
    ).map((day: string | undefined) => ({
      ...data.calendar_data[day || ''],
      price: price,
      start_date: day,
      end_date: day,
      note: privateNotes
    }))
    // console.log('payload', payload)
    try {
      setLoading(true)
      createDateRangeMutation.mutate({ data: { data: payload, id: listing?.id } }, {
        onSuccess: (res) => {
          if (!res.isSucceed) throw res.data
          queryClient.invalidateQueries({ queryKey: ['calendarData'] })
          customToast(
            'success',
            'Private Note Added!',
            'bottom-center',
            'mb-4 sm:m-0'
          )
          setShowAddNotes(false)
          setPrivateNotes('')
          queryClient.invalidateQueries({ queryKey: ['calendarData'] })
        },
        onError: (error) => {
          console.error(error)
        },
        onSettled: () => {
          setLoading(false)
        }
      })
    } catch (error) {
      console.error(error)
    }
  },[createDateRangeMutation, data?.calendar_data, listing?.id, price, privateNotes, queryClient, selectedRange.endDate, selectedRange.startDate])

  const handleBasePriceSubmit = useCallback(async () => {
    const payload = {
      id: listing?.unique_id,
      price: price,
    }
    try {
      setLoading(true)
      updateListingMutation.mutate(payload, {
        onSuccess: (res) => {
          if (!res.isSucceed) throw res.data
          queryClient.invalidateQueries({ queryKey: ['calendarData'] })
          customToast(
            'success',
            'Price Updated',
            'bottom-center',
            'mb-4 sm:m-0'
          )
          setEditing(undefined)
          setListing?.(res.data)
        },
        onError: (err) => {
          console.log(err)
        },
        onSettled: () => {
          setLoading(false)
        },
      })
    } catch (err) {
      console.log(err)
    }
  }, [ listing?.unique_id, price, queryClient, setListing, updateListingMutation ])

  const handleDateRangeSubmit = useCallback(async () => {
    if (!selectedRange.startDate || !selectedRange.endDate) return
    const payload = [
      ...Array(selectedRange.endDate.diff(selectedRange?.startDate, 'day') + 1),
    ]
      .map((_, index) =>
        selectedRange.startDate?.add(index, 'day').format(DATE_FORMAT)
      )
      .map((day: string | undefined) => ({
        ...data.calendar_data[day || ''],
        price: price,
        start_date: day,
        end_date: day,
      }))
    try {
      setLoading(true)
      createDateRangeMutation.mutate(
        { data: { data: payload, id: listing?.id } },
        {
          onSuccess: (res) => {
            if (!res.isSucceed) throw res.data
            customToast(
              'success',
              'Price Updated',
              'bottom-center',
              'mb-4 sm:m-0'
            )
            setEditing(undefined)
            queryClient.invalidateQueries({ queryKey: ['calendarData'] })
          },
          onError: (err) => {
            console.log(err)
          },
          onSettled: () => {
            setLoading(false)
          },
        }
      )
    } catch (err) {
      console.log(err)
    }
  }, [
    selectedRange.startDate,
    selectedRange.endDate,
    data?.calendar_data,
    price,
    createDateRangeMutation,
    listing?.id,
    queryClient,
  ])

  const handleClick: React.MouseEventHandler<HTMLButtonElement> =
    useCallback(() => {
      resetSelected()
      closeModal()
    }, [resetSelected, closeModal])

  const translationStyles = useTransitionStyles()

  const fadeStyles = useFadeStyles()

  return (
    <>
      {/* Edit price input */}
      <Transition in={!!editing && !selectedBooking} timeout={300}>
        {(state) => (
          <div
            className='text-center duration-300 ease-in-out mt-6 bg-white px-5 mb-10 sm:mb-auto '
            style={translationStyles[state]}
          >
            <p className='text-2xl font-semibold'>Per night</p>
            <EditablePriceInput
              setPrice={setPrice}
              price={price}
              guestServicePercent={data?.listing?.guest_service_charge}
              hostServicePercent={data?.listing?.host_service_charge}
              error=''
              className='text-[45px] w-full margin-auto justify-center my-10'
            />
            <Button
              label='Save'
              variant='dark'
              type='button'
              loading={loading}
              onclick={
                editing === 'base_price'
                  ? handleBasePriceSubmit
                  : handleDateRangeSubmit
              }
              className='w-full'
            />
            <Button
              label='Cancel'
              variant='outlined'
              type='button'
              onclick={handleEditPrice('')}
              className='w-full mt-2'
            />
          </div>
        )}
      </Transition>

      {/* read-only base price of a listing - when no date is selected */}
      <Transition
        in={!editing && !selectedRange.startDate && !selectedBooking}
        timeout={300}
      >
        {(state: any) => (
          <div
            className='duration-300 ease-in-out mt-3 sm:mt-6 mb-10 sm:mb-auto bg-white px-5'
            style={fadeStyles[state]}
          >
            <div>
              <div className='flex justify-between items-center'>
                <div className='mt-5 mb-8 font-medium border-black hover:bg-gray-100 p-2 cursor-pointer border-b-2 inline-block'>
                  <div>Pricing</div>
                </div>
                <div className='block sm:hidden'>
                  <button
                    onClick={closeModal}
                    type='button'
                    className='text-black hover:text-gray-800 focus:outline-none'
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <p className='text-lg font-medium mb-6'>Base Price</p>
              <div className='border p-6 rounded-xl mt-2 mr-4'>
                <p className='text-sm'>Per Night</p>
                <div
                  className={`flex flex-row text-[32px] font-bold relative cursor-pointer`}
                  onClick={handleEditPrice('base_price')}
                >
                  <div>৳</div>
                  <div
                    className={`ml-1 pr-5 font-medium outline-transparent bg-none bg-transparent`}
                  >
                    {price}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Transition>

      {/* open/block nights, price chage, add private notes options */}
      <Transition
        in={!editing && !!selectedRange.startDate && !selectedBooking && !showAddNotes}
        timeout={300}
      >
        {(state: any) => (
          <div
            className='duration-300 ease-in-out sm:mt-6 bg-white px-5 pb-10 sm:pb-0'
            style={translationStyles[state]}
          >
            <div className='relative'>
              <div className='mb-3 w-full pt-10 flex justify-between'>
                <span className='text-[22px] font-bold'>
                  {rangeFormatter(
                    selectedRange.startDate,
                    selectedRange.endDate
                  )}
                </span>
                <button
                  onClick={handleClick}
                  type='button'
                  className='text-black hover:text-gray-800 focus:outline-none'
                >
                  <X size={20} />
                </button>
              </div>

              <div
                className={`${loading ? 'pointer-events-none opacity-50' : ''}`}
              >
                <div className='relative border rounded-full mb-4 flex cursor-pointer w-full my-6'>
                  <div
                    className={`my-1 top-0 bottom-0 -z-10 left-0 absolute w-1/2 bg-[#f66c0e] rounded-3xl transition-all duration-300 ease-in-out ${
                      blocked ? 'translate-x-full -mx-1' : 'translate-x-0 mx-1'
                    }`}
                  ></div>
                  <div className='flex w-full z-10'>
                    <button
                      className={`text-sm font-semibold rounded-full text-center px-4 py-3 w-1/2 flex-1 transition-all duration-300 ease-in-out ${
                        blocked ? 'text-darkGray' : 'text-white '
                      }`}
                      onClick={handleBlock(false)}
                    >
                      Open
                    </button>
                    <button
                      className={`text-sm font-semibold rounded-full text-center px-4 py-3 flex-1 w-1/2 transition-all duration-300 ease-in-out ${
                        !blocked ? 'text-darkGray' : 'text-white'
                      }`}
                      onClick={handleBlock(true)}
                    >
                      Block Nights
                    </button>
                  </div>
                </div>
              </div>
              <div className='border p-6 rounded-xl mt-2'>
                <p className='text-sm'>Per Night</p>
                <div
                  className={`flex flex-row text-[32px] font-bold relative cursor-pointer`}
                  onClick={handleEditPrice('price_range')}
                >
                  <div>৳</div>
                  <div
                    className={`ml-1 pr-5 font-semibold outline-transparent bg-none bg-transparent`}
                  >
                    {price}
                  </div>
                </div>
              </div>
            </div>
            
            {/* add private notes */}
            <div 
              className='border rounded-xl mt-5 px-5 py-4 flex justify-between items-center cursor-pointer'
              onClick={() => setShowAddNotes(true) }
            >
              {privateNotes ? 
                <span>You have 1 private note</span> 
                : <span>Add a private note</span>
              }
              <CaretRight size={16} weight='bold' />
            </div>
          </div>
        )}
      </Transition>

      {/* add notes UI */}
      <Transition in={showAddNotes} timeout={300}>
        {(state: any) => (
          <div
            className='duration-300 ease-in-out mx-6 my-8 bg-white pl-2'
            style={translationStyles[state]}
          >
            <div className='my-5'>
              <CaretLeft 
                size={16} 
                weight='bold' 
                className='cursor-pointer'
                onClick={() => setShowAddNotes(false)}
              />
            </div>
            <h2 className='mt-4 mb-5 font-medium'>Your private notes</h2>
            
            <form onSubmit={handleNotesSubmit} className='space-y-4'>
              <textarea 
                name='private-note' 
                className='border rounded-xl w-full h-24 p-2 focus:border-black focus:outline-none' 
                placeholder='Add a private note'
                value={privateNotes}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setPrivateNotes(event.target.value)}
              ></textarea>
              <Button
                label='Save'
                variant='dark'
                type='submit'
                loading={loading}
                className='mt-5 w-full'
              />
            </form>
          </div>
        )}
      </Transition>

      
      <Transition in={!!selectedBooking} timeout={300}>
        {(state: any) => (
          <div
            className='duration-300 ease-in-out mt-2 bg-white max-h-[90vh] overflow-y-scroll pl-2'
            style={translationStyles[state]}
          >
            <div className='mb-1 w-full pt-5 flex justify-between'>
              <span className='text-[22px] font-bold'>
                {rangeFormatter(selectedRange.startDate, selectedRange.endDate)}
              </span>
              <button
                onClick={onBookingSelect(undefined)}
                type='button'
                className='text-black hover:text-gray-800 focus:outline-none'
              >
                <X size={20} />
              </button>
            </div>
            {selectedBooking && (
              <ReservationDetails reservationId={selectedBooking} />
            )}
          </div>
        )}
      </Transition>
    </>
  )
}
