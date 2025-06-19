'use client'
import React, { useCallback, useEffect, FC, useState} from 'react'
import useAddressPredictions from '~/app/create-listing/hooks/useAddressPredictions'
import { DATE_FORMAT } from '~/constants/format'
import { getAsQueryString } from '~/lib/utils/url'
import { useRouter } from 'next/navigation'
import { removeEmptyValue } from '~/lib/utils/object'
import { SearchType, useListingSearchStore } from '~/store/useListingSearchStore'
import dayjs from 'dayjs'
import useCalendar from '~/hooks/calendar/useCalendar'
import { SearchDropDownProps } from '~/app/home/components/search/locationWiseSearch/SearchDropdown'
import { useAnyWhereSearchMeta } from '~/app/home/hooks/useAnyWhereSearchMeta'
import SearchForm from '~/app/home/components/search/locationWiseSearch/SearchForm'
import DestinationDropdown from '~/app/home/components/search/locationWiseSearch/dropdownInputs/DestinationDropdown'
import DateRangeDropdown from '~/app/home/components/search/locationWiseSearch/dropdownInputs/DateRangeDropdown'
import GuestDropdown from '~/app/home/components/search/locationWiseSearch/dropdownInputs/GuestDropdown'
import { SEARCH_TABS } from '~/app/home/constant/tabkeys'

const AnywhereSearch: FC<SearchDropDownProps> = ({ onInputSelect })  => {
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
    router.push(`/${filterQuery}`)

  }

  return (
    <SearchForm
      searchInputMeta={searchInputMeta}
      activeSearchTab={activeSearchTab}
      setActiveSearchTab={setActiveSearchTab}
      handleSubmit={handleSubmit}
      onInputSelect={onInputSelect} 
    >
      <>
        {activeSearchTab === SEARCH_TABS.DESTINATION && 
          <DestinationDropdown 
            searchType={SearchType.anywhere}
            className='left-0 w-[350px] md:w-[450px]'
            predictions={predictions} 
            setActiveSearchTab={setActiveSearchTab} 
          />
        }
        {(activeSearchTab === SEARCH_TABS.CHECK_IN || activeSearchTab === SEARCH_TABS.CHECK_OUT)  && 
          <DateRangeDropdown 
            className='w-full left-0 right-0 px-5'
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
            className='w-[300px] md:w-[350px] right-0 px-7'
            searchType={SearchType.anywhere}
            setActiveSearchTab={setActiveSearchTab} 
          />
        }
      </>
    </SearchForm>
  )
}

export default AnywhereSearch
