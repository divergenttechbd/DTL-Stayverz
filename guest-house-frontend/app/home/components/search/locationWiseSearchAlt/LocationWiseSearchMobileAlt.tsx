'use client'
import dayjs from 'dayjs'
import { FC, useCallback, useEffect, useState } from 'react'
import AnywhereMobileSearch from '~/app/home/components/search/locationWiseSearchMobile/AnywhereMobileSearch'
import useLocationWiseSearchInitialValues from '~/app/home/hooks/useLocationWiseSearchInitialValues'
import CheckInImg from '~/public/images/location-filter/check-in.png'
import CheckOutImg from '~/public/images/location-filter/checkout.png'
import DestinationImg from '~/public/images/location-filter/destinations.png'
import PersonImg from '~/public/images/location-filter/person.png'
import { styles } from '~/styles/classes'


import { CaretRight } from '@phosphor-icons/react/dist/ssr/CaretRight'
import { MapPin } from '@phosphor-icons/react/dist/ssr/MapPin'
import { useAppStore } from '~/store/appStore'


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

const roomFilterMeta = [
  {
    imgUrl: DestinationImg,
    label: 'Destinations',
    placeholder: 'Berlin, Germany',
    className: 'flex-[1.4]',
    value: 'Berlin, Germany',
  },
  {
    imgUrl: CheckInImg,
    label: 'Check In',
    placeholder: 'Add Dates',
    className: 'flex-[1.2]',
    value: '',
  },
  {
    imgUrl: CheckOutImg,
    label: 'Check Out',
    placeholder: 'Add Dates',
    className: 'flex-[1.2]',
    value: '',
  },
  {
    imgUrl: PersonImg,
    label: 'Person',
    placeholder: 'Add Guest',
    className: 'flex-[1.2]',
    value: '',
  },
]

const LocationWiseSearchMobileAlt = () => {

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

  return  (

    <div className='w-full block md:hidden'>
      <SearchOpenerButtonAlt onClick={searchOpen}/>
      <div className={`fixed top-0 bottom-0 left-0 right-0 w-screen h-auto z-[100] bg-gray-100   ${fullScreenSearch ? `slide-in-bottom ${styles.flexCenter}` : 'hidden'}`}>
        <AnywhereMobileSearch
          handleModalClose={searchClose}
          aciveSearchType={aciveSearchType}
          onSearchTypeClick={onSearchTypeClick}
        /> 
      </div>

    </div>

  )
}
export default LocationWiseSearchMobileAlt

type SearchOpenerButtonAltPropsType = {
  onClick: () => void
}
const SearchOpenerButtonAlt: FC<SearchOpenerButtonAltPropsType> = ({ onClick }) => {
  const { initialValues } = useLocationWiseSearchInitialValues()
  

  return (
    <>
      <div onClick={onClick} className='w-full bg-[#ffffff] rounded-full p-1 flex justify-start items-center shadow-md h-[3rem] sm:h-[3.5rem] gap-2'>
        <div className='w-full flex justify-start items-center '>
          <MapPin size={20} fill='#F15927' className='ml-3 mr-2 min-w-[16px] max-w-[16px]'/>
          <p className={`text-xs sm:text-sm font-regular leading-3 ${initialValues?.address?.address ?  'text-[#616161]': 'text-[#9C9C9C]'}  ellipsis-one-line`}>
            {initialValues?.address?.address || 'Search for the location you want !'}
          </p>
        </div>
        <div className={`cursor-pointer h-full py-[10px] px-[15px] sm:px-[20px] rounded-full bg-[#F15927] gap-[2px] text-[#ffffff]  text-xs lg:text-sm font-medium leading-5 ${styles.flexCenter}`}>
          <span className=''>Search</span>
          <CaretRight size={18} fill='#ffffff' className='font-medium'/>
        </div>
      </div>

      {/* <div onClick={onClick} className='stayverz-room-search-mobile block md:hidden  mt-5 md:mt-8 w-full relative'>
        <div className='w-full bg-[#ffffff] rounded-[18.75px] py-5 px-4 flex flex-col gap-[30px] overflow-hidden'  style={{boxShadow: '-15px 30px 67.5px -3.75px #D3D6DA7D'}}>
          <ul className='flex-1 flex flex-col gap-5'>
            {roomFilterMeta.map((item, index) => (
              <li 
                key={index} 
                className='w-full border-b-[1.75px] border-[#E4E4E4] pb-[18px] flex flex-col gap-5'
              >
                <div className={`flex justify-between items-center cursor-pointer  `}>
                  <div className='flex justify-start items-center gap-[10px]'>
                    <div 
                      className='w-[30px] h-[30px] flex justify-center items-center rounded-[6px]' 
                      style={{boxShadow: '0px 0.75px 1.5px 0px #9799C93D'}}
                    >
                      <Image src={item.imgUrl} width={14} height={14} className='w-auto h-[14px]' alt=''/> 
                    </div>
                    <div className='flex flex-col gap-[5px]'>
                      <p className='text-xs font-medium leading-3 text-[#9C9C9C] uppercase'>{item.label}</p>
                      <p className={`text-sm font-medium leading-4 text-[#2D3845] ${!item.value ? 'text-[#616161] font-medium' : 'font-semibold'} `}>{item.value || item.placeholder}</p>
                      <input 
                        className={'hidden'} 
                        type='text' 
                        value={item.value}  
                        placeholder={item.placeholder} 
                        readOnly={true}
                      />
                    </div>
                  </div>
                  <button className='flex justify-center items-center'>
                    <CaretDown className='text-[#808080] font-bold' fontWeight={700} size={14} />
                  </button>

                </div>
                {index === 1 
          && 
          <div className={`!hidden ${styles.flexCenter} rounded-md p-3`} style={{boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px'}}>
            Dropdown Content
          </div>}
              </li>
            ))}
          </ul>
          <button className='flex justify-center items-center gap-[5px] text-[#ffffff]  text-sm font-medium leading-5 text-left p-[15px] rounded-[12px] bg-[#F15927]'>
            <MagnifyingGlass size={16} />
            <span>Search</span>
          </button>
        </div>
        <div className='!hidden absolute left-0 right-0 top-[90px] w-full bg-[#ffffff] rounded-[18.75px] p-4 flex justify-center items-center gap-5 overflow-hidden z-10'  style={{boxShadow: '-15px 30px 67.5px -3.75px #D3D6DA7D'}}>
            Dropdown Content
        </div>
      </div> */}
    </>
  )
}


