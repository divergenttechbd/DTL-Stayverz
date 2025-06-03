import { FC, useCallback } from 'react'
import { dropdownBaseStyles } from '~/app/home/hooks/useAnyWhereSearchMeta'
import { GuestMetaType } from '~/app/rooms/components/guestDropdown/GuestDropDown'
import GuestQuantityHandler from '~/app/rooms/components/guestDropdown/GuestQuantityHandler'
import { SearchType, useListingSearchStore } from '~/store/useListingSearchStore'

const guestMeta: GuestMetaType[] = [
  { title: 'Adults', subtitle: 'Ages 13+', guestKey: 'adult', disabled: false },
  { title: 'Children', subtitle: 'Ages 2–12', guestKey: 'children', disabled: false },
  { title: 'Infants', subtitle: 'Under 2', guestKey: 'infant', disabled: false },
]

type GuestDropdownProps = {
  setActiveSearchTab?:Function
  className: string
  searchType:SearchType
}

const GuestDropdown:FC<GuestDropdownProps> = (props) => {
  const {className,searchType} = props
  const { anywhere,nearby, setGuestsNumber, } = useListingSearchStore()
  
  const handleGuestCount = useCallback((key: string, value: number) => {
    const adultCount = searchType === 'anywhere' ? anywhere.guests.adult : nearby.guests.adult

    setGuestsNumber({ ...(searchType === 'anywhere' ? anywhere.guests : nearby.guests ), [key]: value, ...(((key === 'infant' || key === 'children') && adultCount <= 0) &&  {'adult':1})}, searchType)
  }, [anywhere.guests, nearby.guests, searchType, setGuestsNumber])

  return (
    <div className={`${dropdownBaseStyles} ${className || 'w-[300px] md:w-[350px] right-0 px-7'}`}>
      <div className='space-y-6'>
        {guestMeta.map((item, index) =>
          <GuestQuantityHandler
            key={index + 1}
            title={item.title}
            subtitle={item.subtitle}
            guestKey={item.guestKey}
            guests={searchType === 'anywhere' ? anywhere.guests : nearby.guests}
            adjustGuestCount={handleGuestCount}
            disabled={item.disabled}
            className={`${guestMeta.length - 1 !== index ? 'border-b pb-5' : ''} `}
            canIncrement={true}
          />)}
      </div>
    </div>
  )
}

export default GuestDropdown
