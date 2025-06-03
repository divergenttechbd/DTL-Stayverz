
'use client'
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass'
import dayjs from 'dayjs'
import { FC, useCallback, useEffect, useState } from 'react'
import AnywhereMobileSearch from '~/app/home/components/search/locationWiseSearchMobile/AnywhereMobileSearch'
import NearbyMobileSearch from '~/app/home/components/search/locationWiseSearchMobile/NearbyMobileSearch'
import useLocationWiseSearchInitialValues from '~/app/home/hooks/useLocationWiseSearchInitialValues'

import { useAppStore } from '~/store/appStore'
import { styles } from '~/styles/classes'


export const searchType = {
  ANYWHERE: 'anywhere',
  NEARYBY: 'nearby'
}

export const searchTypeMeta = [
  {
    id: searchType.ANYWHERE,
    name: 'Anywhere',
  },
  {
    id: searchType.NEARYBY,
    name: 'Near By',
  }
]

export const getMonthAndDate = (dateStr: string) => {
  if (dateStr === '') return
  const dateObj = dayjs(dateStr, { format: 'YYYY-MM-DD' })
  const formattedDate = dateObj.format('MMM DD')
  return formattedDate
}

const LocationWiseSearchMobile = () => {

  // ====================== SEARCH OPEN || CLOSE ======================
  const { fullScreenSearch } = useAppStore()
  const { initialValues } = useLocationWiseSearchInitialValues()

  const searchOpen = useCallback(() => {
    useAppStore.setState({ fullScreenSearch: true })
  }, [])

  const searchClose = useCallback(() => {
    useAppStore.setState({ fullScreenSearch: false })
  }, [])


  // ====================== ACTIVE SEARCH SWITCH ======================
  const [aciveSearchType, setActiveSearchType] = useState<string>(searchType.ANYWHERE)

  useEffect(() => {
    initialValues.searchType === 'nearby' ? setActiveSearchType(searchType.NEARYBY) : setActiveSearchType(searchType.ANYWHERE)
  }, [initialValues])

  const onSearchTypeClick = useCallback((searchType: string) => {
    setActiveSearchType(searchType)
  }, [])

  return (
    <div className='w-full '>
      <SearchOpenerButton onClick={searchOpen} />
      {/* FILTER TYPES*/}
      <div className={`fixed top-0 bottom-0 left-0 right-0 w-screen h-auto z-50 bg-gray-100   ${fullScreenSearch ? `slide-in-bottom ${styles.flexCenter}` : 'hidden'}`}>
        {aciveSearchType === searchType.ANYWHERE ?
          <AnywhereMobileSearch
            handleModalClose={searchClose}
            aciveSearchType={aciveSearchType}
            onSearchTypeClick={onSearchTypeClick}
          /> :
          <NearbyMobileSearch
            handleModalClose={searchClose}
            aciveSearchType={aciveSearchType}
            onSearchTypeClick={onSearchTypeClick}
          />}
      </div>
    </div >

  )
}

export default LocationWiseSearchMobile


type SearchOpenerButtonPropsType = {
  onClick: () => void
}

const SearchOpenerButton: FC<SearchOpenerButtonPropsType> = ({ onClick }) => {
  const { initialValues } = useLocationWiseSearchInitialValues()
  return (
    <button onClick={onClick} className='w-full  border px-2 py-1 rounded-full shadow-sm'>
      <div className='flex justify-start items-center gap-2'>
        <div className={`${styles.flexCenter}`}>
          <MagnifyingGlass size={25} color='#222222' />
        </div>
        <div className='flex flex-col justify-start items-start'>
          <p className='text-left text-[13px] text-[#202020] font-semibold ellipsis-one-line'>
            {
              !initialValues.address.address ?
                initialValues.searchType === 'nearby' ? 'Nearby' : 'Anywhere'
                : initialValues.address.address
            }
          </p>
          <div>
            <p className='text-[12px] text-gray-500 font-medium flex gap-1'>
              <span> {
                (initialValues.check_in && initialValues.check_out) ?
                  `${getMonthAndDate(initialValues.check_in)} - ${getMonthAndDate(initialValues.check_out)}`
                  : 'Any week'
              }</span>
              <span>.</span>
              <span>{
                (initialValues.guests.adult > 0 || initialValues.guests.children > 0 || initialValues.guests.infant > 0)
                  ? `${initialValues.guests.adult + initialValues.guests.children} guests` :
                  ' Add guests'}</span>
            </p>
          </div>
        </div>
      </div>
    </button>
  )
}
