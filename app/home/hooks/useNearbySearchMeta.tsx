
'use client'
import { MapPin, NavigationArrow, X } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import useAddressPredictions from '~/app/create-listing/hooks/useAddressPredictions'
import HomeFilterDateRange from '~/app/home/components/calendar/HomeFilterDateRange'
import { RADIUS } from '~/app/home/constant/nearbyRadius'
import { GuestCounts, GuestMetaType } from '~/app/rooms/components/guestDropdown/GuestDropDown'
import GuestQuantityHandler from '~/app/rooms/components/guestDropdown/GuestQuantityHandler'
import { IAddress } from '~/components/form/inputs/LocationInput/LocationInput'
import Modal from '~/components/modal/Modal'
import { DATE_FORMAT } from '~/constants/format'
import useCalendar from '~/hooks/calendar/useCalendar'
import { removeEmptyValue } from '~/lib/utils/object'
import { getAsQueryString } from '~/lib/utils/url'
import { getAddress } from '~/queries/client/map'
import { SearchType, useListingSearchStore } from '~/store/useListingSearchStore'
import { styles } from '~/styles/classes'

const dropdownBaseStyles = 'dropdown mt-[10px] absolute bg-white py-5 rounded-[35px]  shadow z-20 overflow-hidden'


const tabKeys = {
  DESTINATION: 'destination',
  RADIUS: 'radius',
  CHECK_IN: 'check_in',
  CHECK_OUT: 'check_out',
  GUESTS: 'guests',
}

const guestMeta: GuestMetaType[] = [
  { title: 'Adults', subtitle: 'Ages 13+', guestKey: 'adult', disabled: false },
  { title: 'Children', subtitle: 'Ages 2–12', guestKey: 'children', disabled: false },
  { title: 'Infants', subtitle: 'Under 2', guestKey: 'infant', disabled: false },
  // { title: 'Pets', subtitle: 'Bringing a service animal?', guestKey: 'pets', disabled: true },
]



export const useNearbySearchMeta = () => {
  const { nearby, setAddress, setGuestsNumber, setRadius } = useListingSearchStore()
  const { address, radius, check_in, check_out, guests } = nearby
  const router = useRouter()
  const [activeSearchTab, setActiveSearchTab] = useState<string | number>('')
  const predictions = useAddressPredictions(address?.address || '')
  const { selectedRange, setSelectedRange, isSelecting, isPrevious, resetSelected, handleMouseEnter, inSelectedRange, generateDataByMonth, handleMouseClick } = useCalendar(false)
  const [showPermissionModal, setShowPermissionModal] = useState<boolean>(false)

  const handleSetAddress = useCallback((value: IAddress) => setAddress({ ...value }, SearchType.nearby), [setAddress])
  const handleSetRadius = useCallback((value: number | null) => setRadius(value, SearchType.nearby), [setRadius])
  const handleSetAllGuests = useCallback((guests: GuestCounts) => setGuestsNumber({ ...guests }, SearchType.nearby), [setGuestsNumber])
  const handleGuestCount = useCallback((key: string, value: number) => {
    setGuestsNumber({ ...guests, [key]: value }, SearchType.nearby)
  }, [guests, setGuestsNumber])


  const handleSetInitialDateRange = useCallback(() => {
    setSelectedRange({
      startDate: check_in ? dayjs(check_in) : null,
      endDate: check_out ? dayjs(check_out) : null,
    })
  }, [setSelectedRange, check_in, check_out])

  useEffect(() => {
    handleSetInitialDateRange()
  }, [handleSetInitialDateRange])

  const handleCurrentLocation = async () => {
    if (navigator.geolocation) {
      navigator.permissions.query(
        { name: 'geolocation' }
      ).then(function (permissionStatus) {
        if (permissionStatus.state !== 'granted') {
          setShowPermissionModal(true)
        }
      })

      navigator.geolocation.getCurrentPosition(
        async position => {
          const data = await getAddress({ latitude: position.coords.latitude, longitude: position.coords.longitude })
          handleSetAddress({
            // address: prediction.address,
            address: data?.data?.address,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setShowPermissionModal(false)
        },
        error => {
          console.error(error.message)
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
    }
  }

  const handleSubmit = () => {

    const data = {
      latitude: address.lat,
      longitude: address.lng,
      address: address.address,
      radius: radius,
      check_in: selectedRange?.startDate?.format(DATE_FORMAT) || null, /* YYYY-MM-DD */
      check_out: selectedRange?.endDate?.format(DATE_FORMAT) || null, /* YYYY-MM-DD */
      ...((guests.adult > 0 || guests.children > 0 || guests.infant > 0)
        &&
        { guests: [guests.adult, guests.children, guests.infant, guests.pets] }),
      searchType: 'nearby',
    }

    const filterQuery = getAsQueryString(removeEmptyValue(data))
    router.push(`/${filterQuery}`)


  }

  const searchInputMeta = [
    {
      id: tabKeys.DESTINATION,
      title: 'Your Location',
      subTitle: 'Where are you going?',
      borderRight: true,
      onChange: (event: any) => handleSetAddress({ ...address, address: event.target.value, }),
      // isActive: true,
      value: address.address,
      className: 'w-[170px] md:w-[200px]',
      ...((address.address && activeSearchTab === tabKeys.DESTINATION) &&
      {
        render: () => (<button className='absolute top-0 bottom-0 right-5' onClick={() => handleSetAddress({ lat: null, lng: null, address: '' })}><X size={12} /></button>)
      }),

      dropdownInput: () => (
        <div className={`${dropdownBaseStyles} left-0 w-[450px] ${predictions?.length ? 'block' : ''}`}>
          <Modal
            onClose={() => setShowPermissionModal(false)}
            show={showPermissionModal}
            title='Permission not Granted'
            modalContainerclassName='w-96'
            titleContainerClassName='items-center justify-center gap-5 p-4 border-b'
            crossBtnClassName='absolute left-4 top-1/2 -translate-y-1/2'
            bodyContainerClassName='p-6'
          >
            Please Grant Permission
          </Modal>

          <li onClick={() => {
            setActiveSearchTab(tabKeys.RADIUS)
            // setTypedLocation(prediction.address)

            handleCurrentLocation()
            // setDisplaySearchOptions(false)
          }} className='px-5 py-3 flex justify-start items-center gap-3 cursor-pointer hover:bg-gray-100'>
            <div className={`${styles.flexCenter} bg-gray-200 p-2 rounded-xl w-[45px] h-[45px]`}><NavigationArrow size={22} className='' /></div>
            <div>
              <p className='text-[#202020] text-[14px] leading-6'>Use Current Location</p>
            </div>
          </li>

          {predictions?.length ?
            <ul className='py-2 max-h-[400px] overflow-y-auto w-full'>
              {predictions?.map((prediction: any, index: number) =>
                <li onClick={() => {
                  setActiveSearchTab(tabKeys.RADIUS)
                  handleSetAddress({
                    address: prediction.address,
                    lat: prediction.latitude,
                    lng: prediction.longitude
                  })
                }} key={`${prediction.address}-${index + 1}`} className='px-5 py-3 flex justify-start items-center gap-3 cursor-pointer hover:bg-gray-100'>
                  <div className={`${styles.flexCenter} bg-gray-200 p-2 rounded-xl w-[45px] h-[45px]`}><MapPin size={22} className='' /></div>
                  <div>
                    <p className='text-[#202020] text-[14px] leading-6'>{prediction.address}</p>
                  </div>
                </li>
              )}
            </ul> : ''}

        </div>
      )
    },
    {
      id: tabKeys.RADIUS,
      title: 'Radius',
      subTitle: 'Add Radius',
      borderRight: true,
      readOnly: true,
      value: `${radius ? `${radius}km` : ''}`,
      className: 'w-[150px]',
      ...((radius && activeSearchTab === tabKeys.RADIUS) &&
      {
        render: () => (<button className='absolute top-0 bottom-0 right-5' onClick={() => handleSetRadius(null)}><X size={12} /></button>)
      }),

      dropdownInput: () => (
        <div className={`${dropdownBaseStyles} left-[8rem] w-[300px] `}>
          <div className='w-full text-center py-2'>
            <p className='text-[16px] text-[#202020] font-[600]'>Search Your Nearby Hosts</p>
          </div>
          <ul className='py-2 max-h-[400px] overflow-y-auto w-full'>
            {RADIUS.map((option: any, index) =>
              <li onClick={() => {
                handleSetRadius(option)
                setActiveSearchTab(tabKeys.CHECK_IN)
              }} key={option} className={`m-4 py-2 px-5 flex justify-center items-center gap-3 cursor-pointer hover:border-black border-2 rounded-full hover:bg-gray-100 ${radius === option ? 'border-black border-2 bg-gray-100' : ''}`}>
                <p className='text-[#202020] text-[14px] font-[500] leading-6'>Within {option}km near me</p>
              </li>
            )}
          </ul>

        </div>
      )
    },
    {
      id: tabKeys.CHECK_IN,
      title: 'Check In',
      subTitle: 'Add dates',
      borderRight: true,
      // isActive: false,
      value: selectedRange.startDate ? selectedRange.startDate?.format('DD MMM') : '',
      readOnly: true,
      className: 'w-[130px]',
      dropdownInput: () => (
        <div className={`${dropdownBaseStyles} w-full left-0 right-0 px-5`}>
          <div className={`${styles.flexCenter} mt-2`}>
            <HomeFilterDateRange
              // data={null}
              selectedRange={selectedRange}
              isSelecting={isSelecting}
              isPrevious={isPrevious}
              resetSelected={resetSelected}
              handleMouseEnter={handleMouseEnter}
              inSelectedRange={inSelectedRange}
              generateDataByMonth={generateDataByMonth}
              handleMouseClick={(values: any) => {
                selectedRange.startDate && setActiveSearchTab(tabKeys.CHECK_OUT)
                return handleMouseClick(values)
              }}
            />
          </div>
          <div className='flex justify-end items-center gap-3'>
            <button onClick={resetSelected} className='font-[500] text-[14px] text-[#202020] underline py-2'>Clear Dates</button>
          </div>
        </div>
      )
    },
    {
      id: tabKeys.CHECK_OUT,
      title: 'Check Out',
      subTitle: 'Add dates',
      borderRight: true,
      readOnly: true,
      // isActive: false,
      value: selectedRange.endDate ? selectedRange.endDate?.format('DD MMM') : '',
      className: 'w-[130px]',
      ...((selectedRange.endDate && activeSearchTab === tabKeys.CHECK_OUT) &&
      {
        render: () => (
          <button className='absolute top-0 bottom-0 right-5 z-30'
            onClick={(e) => {
              e.stopPropagation()
              setActiveSearchTab(tabKeys.CHECK_IN)
              resetSelected()
            }}
          >
            <X size={12} />
          </button>
        )
      }),
      dropdownInput: () => (
        <div className={`${dropdownBaseStyles} w-full left-0 right-0 px-5`}>
          <div className={`${styles.flexCenter} mt-2`}>
            <HomeFilterDateRange
              // data={null}
              selectedRange={selectedRange}
              isSelecting={isSelecting}
              isPrevious={isPrevious}
              resetSelected={resetSelected}
              handleMouseEnter={handleMouseEnter}
              inSelectedRange={inSelectedRange}
              generateDataByMonth={generateDataByMonth}
              handleMouseClick={handleMouseClick}
            />
          </div>
          <div className='flex justify-end items-center gap-3'>
            <button
              onClick={() => {
                resetSelected()
                setActiveSearchTab(tabKeys.CHECK_IN)
              }}
              className='font-[500] text-[14px] text-[#202020] underline py-2'>Clear Dates</button>
          </div>
        </div>
      )
    },
    {
      id: tabKeys.GUESTS,
      title: 'Who',
      subTitle: 'Add Guests',
      borderRight: false,
      readOnly: true,
      // isActive: false,
      className: 'w-[170px] md:w-[220px]',
      value: guests.adult === 0 && guests.children === 0 ? '' : `${guests.adult + guests.children} guests ${guests.infant > 0 ? `${guests.infant} infant` : ''}`,
      ...(((guests.adult !== 0 || guests.children !== 0 || guests.infant !== 0) && activeSearchTab === tabKeys.GUESTS) && {
        render: () => (
          <button className='absolute top-0 bottom-0 right-[60px]'
            onClick={(e) => {
              e.stopPropagation()
              handleSetAllGuests({ adult: 0, children: 0, infant: 0, pets: 0 })
            }}
          >
            <X size={12} />
          </button>
        )
      }),
      dropdownInput: () => (
        <div className={`${dropdownBaseStyles}  w-[350px] right-0 px-7`}>
          <div className='space-y-6'>
            {guestMeta.map((item, index) =>
              <GuestQuantityHandler
                key={index + 1}
                title={item.title}
                subtitle={item.subtitle}
                guestKey={item.guestKey}
                guests={guests}
                adjustGuestCount={handleGuestCount}
                disabled={item.disabled}
                className={`${guestMeta.length - 1 !== index ? 'border-b pb-5' : ''} `}
                // canIncrement={guests.adult + guests.children < 10}
                canIncrement={true}
              />)}
          </div>
        </div>
      )
    },
  ]

  const ActiveDropDown = () => (
    <>
      {searchInputMeta.filter((item, index) => item.id === activeSearchTab)?.[0]?.dropdownInput()}
    </>
  )

  return {
    searchInputMeta, activeSearchTab, setActiveSearchTab, ActiveDropDown, handleSubmit
  }
}
