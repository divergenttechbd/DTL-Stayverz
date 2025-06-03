'use client'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import useAddressPredictions from '~/app/create-listing/hooks/useAddressPredictions'

import LocationSearchFrom from '~/app/home/components/search/locationWiseSearchAlt/LocationSearchFrom'
import DateRangeDropdown from '~/app/home/components/search/locationWiseSearchAlt/dropdownInputsAlt/DateRangeDropdown'
import DestinationDropdown from '~/app/home/components/search/locationWiseSearchAlt/dropdownInputsAlt/DestinationDropdown'
import GuestDropdown from '~/app/home/components/search/locationWiseSearchAlt/dropdownInputsAlt/GuestDropdown'
import { SEARCH_TABS } from '~/app/home/constant/tabkeys'
import { useAnyWhereSearchMeta } from '~/app/home/hooks/useAnyWhereSearchMeta'
import { DATE_FORMAT } from '~/constants/format'
import useCalendar from '~/hooks/calendar/useCalendar'
import { removeEmptyValue } from '~/lib/utils/object'
import { getAsQueryString } from '~/lib/utils/url'
import { SearchType, useListingSearchStore } from '~/store/useListingSearchStore'


const LocationWiseSearchDesktop = () => {

  const { anywhere } = useListingSearchStore()
  const { address, check_in, check_out, guests } = anywhere
  const router = useRouter()
  const [activeSearchTab, setActiveSearchTab] = useState<string | number>(SEARCH_TABS.DESTINATION)
  const predictions = useAddressPredictions(address.address || '')
  const calendarInstance = useCalendar(false)
  const { selectedRange, setSelectedRange, handleMouseClick } = calendarInstance
  const anywhereSearchMeta = useAnyWhereSearchMeta({...calendarInstance,activeSearchTab,setActiveSearchTab})
  const { searchInputMeta } = anywhereSearchMeta

  const handleSetInitialDateRange = useCallback(() => {
    setSelectedRange({
      startDate: check_in ? dayjs(check_in) : null,
      endDate: check_out ? dayjs(check_out) : null,
    })
  }, [setSelectedRange, check_in, check_out])

  useEffect(() => {
    handleSetInitialDateRange()
  }, [handleSetInitialDateRange])

  const handleSubmit = () => {
    const data = {
      latitude: address.lat,
      longitude: address.lng,
      address: address.address,
      check_in: selectedRange?.startDate?.format(DATE_FORMAT) || null, /* YYYY-MM-DD */
      check_out: selectedRange?.endDate?.format(DATE_FORMAT) || null, /* YYYY-MM-DD */
      ...((guests.adult > 0 || guests.children > 0 || guests.infant > 0)
        &&
        { guests: [guests.adult, guests.children, guests.infant, guests.pets] }),
      searchType: 'anywhere',
    }
    const filterQuery = getAsQueryString(removeEmptyValue(data))
    router.push(`room-list/${filterQuery}`)

  }

  return (  
    <div className='hidden md:block w-full'>
      <LocationSearchFrom
        searchInputMeta={searchInputMeta}
        activeSearchTab={activeSearchTab}
        setActiveSearchTab={setActiveSearchTab}
        handleSubmit={handleSubmit}
        onInputSelect={() => {
          console.log('on input select!')
        }} 
      >
        <>
          {activeSearchTab === SEARCH_TABS.DESTINATION && 
          <DestinationDropdown 
            searchType={SearchType.anywhere}
            className='dropdown absolute right-0 top-[80px] left-0 w-[350px] md:w-[450px] bg-[#ffffff] rounded-[15px] py-4 flex justify-center items-center gap-5 overflow-hidden z-10 shadow-lg'
            predictions={predictions} 
            setActiveSearchTab={setActiveSearchTab} 
          />
          }
          {(activeSearchTab === SEARCH_TABS.CHECK_IN || activeSearchTab === SEARCH_TABS.CHECK_OUT)  && 
          <DateRangeDropdown 
            className='dropdown absolute max-w-[650px] left-[5%] right-0 mx-auto top-[80px] w-full bg-[#ffffff] rounded-[15px] p-4 overflow-hidden z-10 shadow-lg'
            {...calendarInstance}
            handleMouseClick={(values: any) => {
              activeSearchTab === SEARCH_TABS.CHECK_IN && selectedRange.startDate && setActiveSearchTab(SEARCH_TABS.CHECK_OUT)
              return handleMouseClick(values)
            }}
            setActiveSearchTab={setActiveSearchTab} 
          />
      
          }
          {activeSearchTab === SEARCH_TABS.GUESTS && 
          <GuestDropdown 
            className='dropdown absolute w-[300px] md:w-[350px] lg:w-[370px] right-0 px-7 top-[80px] bg-[#ffffff] rounded-[15px] p-4 overflow-hidden z-10 shadow-lg'
            searchType={SearchType.anywhere}
            setActiveSearchTab={setActiveSearchTab} 
          />
          }
        </>
      </LocationSearchFrom>
    </div>)
}
export default LocationWiseSearchDesktop
