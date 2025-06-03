import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass'
import { MapPin } from '@phosphor-icons/react/dist/ssr/MapPin'
import { X } from '@phosphor-icons/react/dist/ssr/X'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { FC, useCallback, useEffect, useState } from 'react'
import useAddressPredictions from '~/app/create-listing/hooks/useAddressPredictions'
import HomeFilterDateRange from '~/app/home/components/calendar/HomeFilterDateRange'
import SearchActions from '~/app/home/components/search/locationWiseSearchMobile/SearchActions'
import SearchHeader from '~/app/home/components/search/locationWiseSearchMobile/SearchHeader'
import { SEARCH_TABS } from '~/app/home/constant/tabkeys'
import { GuestCounts, GuestMetaType } from '~/app/rooms/components/guestDropdown/GuestDropDown'
import GuestQuantityHandler from '~/app/rooms/components/guestDropdown/GuestQuantityHandler'
import { IAddress } from '~/components/form/inputs/LocationInput/LocationInput'
import { DATE_FORMAT } from '~/constants/format'
import useCalendar from '~/hooks/calendar/useCalendar'
import { removeEmptyValue } from '~/lib/utils/object'
import { getAsQueryString } from '~/lib/utils/url'
import { SearchType, useListingSearchStore } from '~/store/useListingSearchStore'
import { styles } from '~/styles/classes'


const guestMeta: GuestMetaType[] = [
  { title: 'Adults', subtitle: 'Ages 13+', guestKey: 'adult', disabled: false },
  { title: 'Children', subtitle: 'Ages 2–12', guestKey: 'children', disabled: false },
  { title: 'Infants', subtitle: 'Under 2', guestKey: 'infant', disabled: false },
  // { title: 'Pets', subtitle: 'Bringing a service animal?', guestKey: 'pets', disabled: true },
]

type AnywhereMobileSearchPropsType = {
  aciveSearchType: string
  handleModalClose: () => void
  onSearchTypeClick: (searchType: string) => void
}


const AnywhereMobileSearch: FC<AnywhereMobileSearchPropsType> = ({ handleModalClose, onSearchTypeClick, aciveSearchType }) => {
  const { anywhere, setAddress, setGuestsNumber } = useListingSearchStore()
  const { address, check_in, check_out, guests } = anywhere
  const router = useRouter()
  const { selectedRange, setSelectedRange, isSelecting, isPrevious, resetSelected, handleMouseEnter, inSelectedRange, generateDataByMonth, handleMouseClick } = useCalendar(false)
  const [activeTab, setActiveTab] = useState('')
  const predictions = useAddressPredictions(address.address || '')

  const handleSetAddress = useCallback((value: IAddress) => setAddress({ ...value }, SearchType.anywhere), [setAddress])
  const handleSetAllGuests = useCallback((guests: GuestCounts) => setGuestsNumber({ ...guests }, SearchType.anywhere), [setGuestsNumber])
  const handleGuestCount = useCallback((key: string, value: number) => {

    const adultCount =  anywhere.guests.adult 
    setGuestsNumber({ ...guests, [key]: value , ...(((key === 'infant' || key === 'children') && adultCount <= 0) &&  {'adult':1})}, SearchType.anywhere)
  }, [guests, setGuestsNumber, anywhere.guests.adult])




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
    setAddress({ lat: null, lng: null, address: '' }, SearchType.anywhere)
  }, [setAddress])

  const handleAddressSelect = useCallback((prediction: IAddress) => {
    handleSetAddress({
      lat: prediction.lat,
      lng: prediction.lng,
      address: prediction.address
    })

    setActiveTab(SEARCH_TABS.CHECK_IN_OUT)
  }, [handleSetAddress, setActiveTab])

  const clearAllSearches = useCallback(() => {
    clearAddress()
    resetSelected()
    handleSetAllGuests({ adult: 0, children: 0, infant: 0, pets: 0 })
    setActiveTab('')
  }, [clearAddress, resetSelected, setActiveTab, handleSetAllGuests])

  const handleSubmit = useCallback(() => {
    const data = {
      latitude: address.lat,
      longitude: address.lng,
      address: address.address,
      check_in: selectedRange?.startDate?.format(DATE_FORMAT) || null, /* YYYY-MM-DD */
      check_out: selectedRange?.endDate?.format(DATE_FORMAT) || null, /* YYYY-MM-DD */
      // ...((guests.adult > 0 || guests.children > 0) && { guests: guests.adult + guests.children }),
      ...((guests.adult > 0 || guests.children > 0 || guests.infant > 0)
      &&
      { guests: [guests.adult, guests.children, guests.infant, guests.pets] }),
      searchType: 'anywhere',
    }
    const filterQuery = getAsQueryString(removeEmptyValue(data))
    router.push(`room-list/${filterQuery}`)
    handleModalClose()
    setActiveTab('')
  }, [address, selectedRange, guests, router, handleModalClose])

  


  return (
    <div className={`w-full h-full flex flex-col justify-between gap-5`}>
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
              {predictions?.length ?
                <ul className='space-y-4 pb-[60px]'>
                  {predictions.map((prediction, index: number) => (
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
                  ))}
                </ul>
                :
                null}
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
              <span className='text-gray-500 text-[14px] font-[400] w-full flex-[0.3] whitespace-nowrap'>Where</span>
              {address.address ?
                <span className='text-[#202020] text-[14px] font-[500] flex-[1.7]  ellipsis-one-line text-right'>{address.address} </span>
                :
                <span className='text-[#202020] text-[14px] font-[500] flex-[1.7]  ellipsis-one-line text-right'>I am Flexible</span>}
            </div>
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
                    resetSelected={resetSelected}
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
                  {guests.adult > 0 || guests.children > 0 ? `${guests.adult + guests.children} ${(guests.adult + guests.children <= 1) ? 'guest' : 'guests'}` : 'Add guests'}
                </span>
              </div>
              :
              <div className='px-3 py-4 rounded-2xl bg-white shadow-lg space-y-3'>
                <p className='text-[#202020] text-[20px] font-[600]'>Who&rsquo;s comming?</p>
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

export default AnywhereMobileSearch
