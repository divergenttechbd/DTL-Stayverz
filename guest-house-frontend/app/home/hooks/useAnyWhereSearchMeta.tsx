
'use client'
import { X } from '@phosphor-icons/react'
import { CaretDown } from '@phosphor-icons/react/dist/ssr/CaretDown'
import { useCallback, useMemo } from 'react'
import { SEARCH_TABS } from '~/app/home/constant/tabkeys'
import { DateRangeTypes } from '~/app/rooms/components/RoomDetails'
import { GuestCounts } from '~/app/rooms/components/guestDropdown/GuestDropDown'
import { IAddress } from '~/components/form/inputs/LocationInput/LocationInput'
import CheckInImg from '~/public/images/location-filter/check-in.png'
import CheckOutImg from '~/public/images/location-filter/checkout.png'
import DestinationImg from '~/public/images/location-filter/destinations.png'
import PersonImg from '~/public/images/location-filter/person.png'
import { SearchType, useListingSearchStore } from '~/store/useListingSearchStore'

export const dropdownBaseStyles = 'dropdown mt-[10px] absolute bg-white py-5 rounded-[35px] shadow z-20 overflow-hidden'

interface anyWhereSearchPropsType extends DateRangeTypes {
  activeSearchTab: string | number
  setActiveSearchTab:Function
}

export const useAnyWhereSearchMeta = (props : anyWhereSearchPropsType) => {
  const { anywhere,setAddress ,setGuestsNumber} = useListingSearchStore()
  const { address, guests } = anywhere
  const { selectedRange, resetSelected ,  activeSearchTab, setActiveSearchTab} = props
  const handleSetAddress = useCallback((value: IAddress) => setAddress({ ...value }, SearchType.anywhere), [setAddress])
  const handleSetAllGuests = useCallback((guests: GuestCounts) => setGuestsNumber({ ...guests }, SearchType.anywhere), [setGuestsNumber])


  

  const searchInputMeta = useMemo(() => ([
    {
      id: SEARCH_TABS.DESTINATION,
      imgUrl: DestinationImg,
      title: 'Where',
      subTitle: 'Search Destinations',
      borderRight: true,
      onChange: (event: any) => handleSetAddress({ ...address, address: event.target.value, }),
      value: address.address,
      className: 'flex-[1.4]',
      ...((address.address && activeSearchTab === SEARCH_TABS.DESTINATION) ?
        {
          render: () => (
            <button className='flex justify-center items-center'
              onClick={() => handleSetAddress({ lat: null, lng: null, address: '' })}><X size={12} /></button>
          )
        } :  {
          render: () => (
            <button className='flex justify-center items-center'>
              <CaretDown className='opacity-0 text-[#808080] font-bold' size={14} />
            </button>)
        }),
    },
    {
      id: SEARCH_TABS.CHECK_IN,
      imgUrl: CheckInImg,
      title: 'Check In',
      subTitle: 'Add dates',
      borderRight: true,
      value: selectedRange?.startDate ? selectedRange.startDate?.format('DD MMM') : '',
      readOnly: true,
      className: 'flex-[1.2]',
      render: () => (
        <button className='flex justify-center items-center'>
          <CaretDown className='opacity-0 text-[#808080] font-bold' size={14} />
        </button>)
      
    },
    {
      id: SEARCH_TABS.CHECK_OUT,
      imgUrl: CheckOutImg,
      title: 'Check Out',
      subTitle: 'Add dates',
      borderRight: true,
      readOnly: true,
      value: selectedRange?.endDate ? selectedRange.endDate?.format('DD MMM') : '',
      className: 'flex-[1.2]',
      ...((selectedRange?.endDate && activeSearchTab === SEARCH_TABS.CHECK_OUT) ?
        {
          render: () => (
            <button className='flex justify-center items-center'
              onClick={(e) => {
                e.stopPropagation()
                setActiveSearchTab(SEARCH_TABS.CHECK_IN)
                resetSelected()
              }}
            >
              <X size={12} />
            </button>
          )
        } : {
          render: () => (<button className='flex justify-center items-center'>
            <CaretDown className='opacity-0 text-[#808080] font-bold' size={14} />
          </button>)
        }),
    },
    {
      id: SEARCH_TABS.GUESTS,
      imgUrl: PersonImg,
      title: 'Who',
      subTitle: 'Add Guests',
      borderRight: false,
      readOnly: true,
      className: 'flex-[1.2]',
      value: guests.adult === 0 && guests.children === 0 ? '' : `${guests.adult + guests.children} ${(guests.adult + guests.children <= 1) ? 'guest' : 'guests'} ${guests.infant > 0 ? `${guests.infant} ${guests.infant <= 1 ? 'infant' : 'infants'}` : ''}`,
      ...(((guests.adult !== 0 || guests.children !== 0 || guests.infant !== 0) && activeSearchTab === SEARCH_TABS.GUESTS) ? {
        render: () => (
          <button className='flex justify-center items-center'
            onClick={(e) => {
              e.stopPropagation()
              handleSetAllGuests({ adult: 0, children: 0, infant: 0, pets: 0 })
            }}
          >
            <X size={12} />
          </button>
        )
      } :  {
        render: () => (
          <button className='flex justify-center items-center'>
            <CaretDown className='opacity-0 text-[#808080] font-bold' size={14} />
          </button>)
      }),
    },
  ]),[activeSearchTab, address, guests.adult, guests.children, guests.infant, handleSetAddress, handleSetAllGuests, resetSelected, selectedRange.endDate, selectedRange.startDate, setActiveSearchTab])



  return {
    searchInputMeta
  }
}
