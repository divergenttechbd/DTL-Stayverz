import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass'
import { MapPin } from '@phosphor-icons/react/dist/ssr/MapPin'
import { NavigationArrow } from '@phosphor-icons/react/dist/ssr/NavigationArrow'
import { X } from '@phosphor-icons/react/dist/ssr/X'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { FC, useCallback, useEffect, useState } from 'react'
import useAddressPredictions from '~/app/create-listing/hooks/useAddressPredictions'
import HomeFilterDateRange from '~/app/home/components/calendar/HomeFilterDateRange'
import SearchActions from '~/app/home/components/search/locationWiseSearchMobile/SearchActions'
import SearchHeader from '~/app/home/components/search/locationWiseSearchMobile/SearchHeader'
import { RADIUS } from '~/app/home/constant/nearbyRadius'
import { SEARCH_TABS } from '~/app/home/constant/tabkeys'
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



const guestMeta: GuestMetaType[] = [
  { title: 'Adults', subtitle: 'Ages 13+', guestKey: 'adult', disabled: false },
  { title: 'Children', subtitle: 'Ages 2–12', guestKey: 'children', disabled: false },
  { title: 'Infants', subtitle: 'Under 2', guestKey: 'infant', disabled: false },
  // { title: 'Pets', subtitle: 'Bringing a service animal?', guestKey: 'pets', disabled: true },
]

type NearbyMobileSearch = {
  aciveSearchType: string
  handleModalClose: () => void
  onSearchTypeClick: (searchType: string) => void
}


const NearbyMobileSearch: FC<NearbyMobileSearch> = ({ handleModalClose, onSearchTypeClick, aciveSearchType }) => {
  const { nearby, setAddress, setGuestsNumber, setRadius } = useListingSearchStore()
  const { address, radius, check_in, check_out, guests } = nearby
  const router = useRouter()
  const { selectedRange, setSelectedRange, isSelecting, isPrevious, resetSelected: resetSelectedDate, handleMouseEnter, inSelectedRange, generateDataByMonth, handleMouseClick } = useCalendar(false)
  const [activeTab, setActiveTab] = useState('')
  const predictions = useAddressPredictions(address.address || '')


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


  const clearAddress = useCallback(() => {
    handleSetAddress({ lat: null, lng: null, address: '' })
  }, [handleSetAddress])

  const handleAddressSelect = useCallback((prediction: IAddress) => {
    handleSetAddress({
      lat: prediction.lat,
      lng: prediction.lng,
      address: prediction.address
    })

    setActiveTab(SEARCH_TABS.RADIUS)
  }, [handleSetAddress, setActiveTab])


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

    setActiveTab(SEARCH_TABS.RADIUS)
  }

  const handleRadiusSelect = useCallback((selectedValue: number) => {
    handleSetRadius(selectedValue)
    setActiveTab(SEARCH_TABS.CHECK_IN_OUT)
  }, [handleSetRadius, setActiveTab])



  // MAIN ACTIONS
  const clearAllSearches = useCallback(() => {
    clearAddress()
    handleSetRadius(null)
    resetSelectedDate()
    handleSetAllGuests({ adult: 0, children: 0, infant: 0, pets: 0 })
    setActiveTab('')
  }, [clearAddress, resetSelectedDate, handleSetAllGuests, setActiveTab, handleSetRadius])

  const handleSubmit = useCallback(() => {
    const data = {
      latitude: address.lat,
      longitude: address.lng,
      address: address.address,
      radius: radius,
      check_in: selectedRange?.startDate?.format(DATE_FORMAT) || null, /* YYYY-MM-DD */
      check_out: selectedRange?.endDate?.format(DATE_FORMAT) || null, /* YYYY-MM-DD */
      ...((guests.adult > 0 || guests.children > 0) && { guests: guests.adult + guests.children }),
      searchType: 'nearby',

    }

    const filterQuery = getAsQueryString(removeEmptyValue(data))
    router.push(`/${filterQuery}`)
    handleModalClose()
    setActiveTab('')
  }, [address, selectedRange, guests, router, handleModalClose, radius])



  return (
    <div className={`w-full h-full flex flex-col justify-between gap-5`}>

      {/* CURRENT LOCATION MODAL PERMISSION */}
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

      {/* SECTION TOP */}
      <SearchHeader
        activeTab={activeTab}
        handleModalClose={handleModalClose}
        setActiveTab={setActiveTab}
        aciveSearchType={aciveSearchType}
        onSearchTypeClick={onSearchTypeClick}
      />

      {/* DESTINATION DROPDOWN */}
      <div className={`h-full bg-white overflow-y-hidden rounded-tl-3xl border-t rounded-tr-3xl shadow-lg ${activeTab === SEARCH_TABS.DESTINATION ? 'slide-in-bottom block' : 'hidden'}`}>
        <div className='flex flex-col gap-5 justify-between px-5 py-4'>
          {/* <p className='text-[#202020] text-[20px] font-[600]'>Where to?</p> */}
          {/* INPUT */}
          <div className='flex-1 px-3 py-4 rounded-2xl bg-gray-100 mt-5'>
            <div className='w-full relative flex justify-between items-center gap-2'>
              <div className={`${styles.flexCenter}`}>
                <label htmlFor='destination'>
                  <MagnifyingGlass size={20} fill='#222222' />
                </label>
              </div>
              <input
                autoComplete='off'
                value={address.address}
                onChange={(e: any) => handleSetAddress({ lat: null, lng: null, address: e.target.value })}
                id='destination'
                name='destination'
                type='text'
                placeholder='Search Destination'
                className='w-full border-0 outline-none bg-inherit text-[15px]'
              />
              {address.address ?
                <button onClick={clearAddress} className='border-0 outline-none'>
                  <X size={15} fill='#222222' />
                </button> : null
              }
            </div>
          </div>
          {/* SELECT */}
          <div className='h-[80vh] overflow-y-hidden'>
            <div className='h-full overflow-y-scroll scrollbar-hidden'>
              <ul className='space-y-4 pb-[60px]'>
                <li
                  onClick={handleCurrentLocation}
                >
                  <div className='w-full flex justify-start items-center gap-3'>
                    <div>
                      <div className={`${styles.flexCenter} bg-gray-200 rounded-xl h-10 w-10`}>
                        <NavigationArrow fill='#222222' size={25} />
                      </div>
                    </div>
                    <p className='text-[#202020] text-[14px] font-[500] ellipsis-two-line leading-6'>Use Current Location</p>
                  </div>
                </li>
                {predictions?.length ?
                  predictions.map((prediction, index: number) => (
                    <li
                      key={`${prediction}-${index + 1}`}
                      onClick={() => handleAddressSelect(prediction)}
                    >
                      <div className='w-full flex justify-start items-center gap-3'>
                        <div>
                          <div className={`${styles.flexCenter} bg-gray-200 rounded-xl h-10 w-10`}>
                            <MapPin fill='#222222' size={25} />
                          </div>
                        </div>
                        <p className='text-[#202020] text-[14px] font-[500] ellipsis-two-line leading-6'>{prediction?.address}</p>
                      </div>
                    </li>
                  )) : null}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH ITEMS */}
      <div className={`h-full overflow-y-auto px-5 ${activeTab !== SEARCH_TABS.DESTINATION ? 'block' : 'hidden'}`}>
        <div className='space-y-3'>
          {/* LOCATION */}
          <div className='space-y-3'>
            <div onClick={() => setActiveTab(SEARCH_TABS.DESTINATION)} className='px-3 py-4 rounded-2xl bg-white shadow-md flex justify-between items-center gap-2'>
              <span className='text-gray-500 text-[14px] font-[400] flex-[0.3] whitespace-nowrap'>My Location</span>
              {address.address ?
                <span className='text-[#202020] text-[14px] font-[500] flex-[1.7]  ellipsis-one-line text-right'>{address.address} </span>
                :
                <span className='text-[#202020] text-[14px] font-[500] flex-[1.7]  ellipsis-one-line text-right'>Select Location</span>}
            </div>
          </div>

          {/* RADIUS */}
          <div className='space-y-3'>
            {activeTab !== SEARCH_TABS.RADIUS ?
              <div onClick={() => setActiveTab(SEARCH_TABS.RADIUS)} className='px-3 py-4 rounded-2xl bg-white shadow-md flex justify-between items-center'>
                <span className='text-gray-500 text-[14px] font-[400]'>Radius</span>
                <span className='text-[#202020] text-[14px] font-[500]'>{radius ? `Within ${radius} km` : 'Select Radius'} </span>
              </div>
              :
              <div className='px-3 py-4 rounded-2xl bg-white shadow-lg overflow-y-scroll scrollbar-hidden space-y-3'>
                <p className='text-[#202020] text-[20px] font-[600]'>Preffered radius?</p>
                <ul className='space-y-3'>
                  {RADIUS.map((item, index) =>
                    <li
                      key={`${item}-${index + 1}`}
                      onClick={() => handleRadiusSelect(item)}
                      className={`${styles.flexCenter} py-2 w-full border border-gray-300 rounded-full ${radius === item ? 'bg-gray-100' : ''}`}
                    >
                      <p className='text-[#202020] text-[14px] font-[600]'>Within {item} km near me</p>
                    </li>)}
                </ul>
              </div>}
          </div>

          {/* DATE RANGE */}
          <div className='space-y-3'>
            {activeTab !== SEARCH_TABS.CHECK_IN_OUT ?
              <div onClick={() => setActiveTab(SEARCH_TABS.CHECK_IN_OUT)} className='px-3 py-4 rounded-2xl bg-white shadow-md flex justify-between items-center'>
                <span className='text-gray-500 text-[14px] font-[400]'>When</span>
                <span className='text-[#202020] text-[14px] font-[500]'>
                  {(selectedRange.startDate && selectedRange.endDate) ?
                    `${selectedRange.startDate?.format('DD MMM')} - ${selectedRange.endDate?.format('DD MMM')}`
                    : 'Add Dates'}
                </span>
              </div>
              :
              <div className='px-3 py-4 rounded-2xl bg-white shadow-lg h-full overflow-y-scroll scrollbar-hidden space-y-3'>
                <p className='text-[#202020] text-[20px] font-[600]'>When&rsquo;s your trip?</p>
                <div className={`${styles.flexCenter} mt-2`}>
                  <HomeFilterDateRange
                    selectedRange={selectedRange}
                    isSelecting={isSelecting}
                    // data={null}
                    isPrevious={isPrevious}
                    resetSelected={resetSelectedDate}
                    handleMouseEnter={handleMouseEnter}
                    inSelectedRange={inSelectedRange}
                    generateDataByMonth={generateDataByMonth}
                    handleMouseClick={handleMouseClick}
                  />
                </div>
              </div>}
          </div>

          {/* GUEST COUNT */}
          <div className='space-y-3'>
            {activeTab !== SEARCH_TABS.GUESTS ?
              <div onClick={() => setActiveTab(SEARCH_TABS.GUESTS)} className='px-3 py-4 rounded-2xl bg-white shadow-md flex justify-between items-center'>
                <span className='text-gray-500 text-[14px] font-[400]'>Who</span>
                <span className='text-[#202020] text-[14px] font-[500]'>
                  {guests.adult > 0 || guests.children > 0 ? `${guests.adult + guests.children} guests` : 'Add guests'}
                </span>
              </div>
              :
              <div className='px-3 py-4 rounded-2xl bg-white shadow-lg space-y-3'>
                <p className='text-[#202020] text-[20px] font-[600]'>Who&rsquo;s coming?</p>
                <div className='space-y-3'>
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
              </div>}

          </div>
        </div>
      </div>

      {/* SEARCH ACTIONS */}
      <div className={`flex-1  ${activeTab !== SEARCH_TABS.DESTINATION ? 'block' : 'hidden'}`}>
        <SearchActions clearAllSearches={clearAllSearches} handleSubmit={handleSubmit} />
      </div>
    </div>
  )
}

export default NearbyMobileSearch
