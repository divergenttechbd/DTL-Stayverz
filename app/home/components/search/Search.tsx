'use client'
import { MagnifyingGlass } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import { useCallback, useRef } from 'react'
import SearchDropdown from '~/app/home/components/search/locationWiseSearch/SearchDropdown'
import useLocationWiseSearchInitialValues from '~/app/home/hooks/useLocationWiseSearchInitialValues'
import { useDetectOutsideClick } from '~/hooks/useDetectOutsideClick'
import { useAppStore } from '~/store/appStore'

const getMonthAndDate = (dateStr: string) => {
  if (dateStr === '') return
  const dateObj = dayjs(dateStr, { format: 'YYYY-MM-DD' })
  const formattedDate = dateObj.format('MMM DD')
  return formattedDate
}

const Search = () => {
  const { extendedNavbar } = useAppStore()

  // ================= OPEN || CLOSE SEARCH =================
  const openSearch = useCallback(() => {
    useAppStore.setState({ extendedNavbar: true })
  }, [])


  const closeSearch = useCallback(() => {
    useAppStore.setState({ extendedNavbar: false })
  }, [])


  const searchRef = useRef(null)
  useDetectOutsideClick(searchRef, closeSearch, true)


  // ================= SEARCHED VALUES =================
  const { initialValues } = useLocationWiseSearchInitialValues()


  return (
    <div ref={searchRef} className=''>
      {/* SEARCH ENABLE COMPONENT */}
      <div onClick={openSearch} className={`${!extendedNavbar ? 'block' : 'hidden'} mx-auto border-[1px] w-full md:w-[max-content] py-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer`}>
        <div className='flex flex-row items-center justify-between'>
          <div className=' px-6 max-w-[200px]'>
            <p className='text-sm font-semibold ellipsis-one-line'>{
              !initialValues.address.address ?
                initialValues.searchType === 'nearby' ? 'Nearby' : 'Anywhere'
                : initialValues.address.address
            }</p>
          </div>
          <div className='hidden sm:block text-sm font-semibold px-6 border-x-[1px] flex-1 text-center'>
            {(initialValues.check_in && initialValues.check_out) ?
              `${getMonthAndDate(initialValues.check_in)} - ${getMonthAndDate(initialValues.check_out)}`
              : 'Any week'}
          </div>
          <div className='text-sm pl-6 pr-2 flex flex-row items-center gap-3'>
            <div className='hidden sm:block font-semibold'>{
              (initialValues.guests.adult > 0 || initialValues.guests.children > 0 || initialValues.guests.infant > 0)
                ? `${initialValues.guests.adult + initialValues.guests.children} guests` :
                ' Add guests'}
            </div>
            <div className='p-2 bg-[#f66c0e] rounded-full text-white'>
              <MagnifyingGlass size={18} />
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className={`search absolute z-20 left-0 right-0 m-auto w-[95vw] md:max-w-[800px] top-[17px]  ${extendedNavbar ? 'block slide-in-top' : 'hidden'}`}>
        <SearchDropdown onInputSelect={closeSearch} />
      </div>

      {/* BACKDROP */}
      <div onClick={closeSearch} className={`fixed z-[0] bg-[rgba(0,0,0,0.5)] w-full h-[calc(100vh-170px)] left-0 right-0 bottom-0 ${extendedNavbar ? 'block' : 'hidden'}`}></div>
    </div >
  )
}

export default Search






