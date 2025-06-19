'use client'
import Image from 'next/image'
import { Dispatch, FC, SetStateAction } from 'react'
import { DropDownBody, DropDownHead, DropdownContainer } from '~/app/rooms/components/guestDropdown/CustomDropDown'
import GuestQuantityHandler from '~/app/rooms/components/guestDropdown/GuestQuantityHandler'
import PersonImg from '~/public/images/location-filter/person.png'
import { styles } from '~/styles/classes'

export type GuestCounts = {
  adult: number
  children: number
  infant: number
  pets: number
}

export type GuestMetaType = {
  title: string
  subtitle: string
  guestKey: keyof GuestCounts
  disabled?: boolean
}

type GuestDropDownProps = {
  guests: GuestCounts
  setGuestsNumber: Dispatch<SetStateAction<GuestCounts>>
  maxGuests: number
}


const GuestDropDown: FC<GuestDropDownProps> = ({ maxGuests, guests, setGuestsNumber }) => {


  const guestMeta: GuestMetaType[] = [
    { title: 'Adults', subtitle: 'Ages 13+', guestKey: 'adult', disabled: false },
    { title: 'Children', subtitle: 'Ages 2–12', guestKey: 'children', disabled: false },
    { title: 'Infants', subtitle: 'Under 2', guestKey: 'infant', disabled: false },
    // { title: 'Pets', subtitle: 'Bringing a service animal?', guestKey: 'pets', disabled: true },
  ]


  return (
    <DropdownContainer>
      {(props) => (
        <>
          <DropDownHead {...props}>
            <div className='p-2 w-full flex justify-start items-center gap-3'>
              <div 
                className={`w-[30px] h-[30px] ${styles.flexCenter} rounded-full bg-[#FBF1FF] shadow-[0px,0.75px,1.5px,0px,#9799C93D]`} 
              >
                <Image src={PersonImg} width={12} height={12} className='w-auto h-[12px]' alt=''/> 
              </div>
              <div className='flex flex-col justify-start items-start gap-1'>
                <p className='text-[#9C9C9C]  uppercase text-xs font-medium leading-4'>Guests</p>
                <p className='text-[#202020] text-base font-medium leading-6'>
                  {guests.adult + guests.children}  {(guests.adult + guests.children <= 1) ? 'guest' : 'guests'} {guests.infant > 0 && `, ${guests.infant} ${guests.infant <= 1 ? 'infant' : 'infants'}`}
                </p>
              </div>
            </div>
          </DropDownHead>
          <DropDownBody {...props}>
            <div className='space-y-5'>
              {guestMeta.map((item, index) =>
                <GuestQuantityHandler
                  key={index + 1}
                  title={item.title}
                  subtitle={item.subtitle}
                  guestKey={item.guestKey}
                  guests={guests}
                  setGuestsNumber={setGuestsNumber}
                  disabled={item.disabled}
                  canIncrement={guests.adult + guests.children < maxGuests}
                />)}
              <p className='text-[#202020] text-[12px] font-[400]'>This place has a maximum of {maxGuests} guests.</p>
              <div className='flex justify-end items-center'>
                <button onClick={props.handleClose} className='text-[#202020] text-[16px] font-semibold underline hover:bg-[rgba(0,0,0,0.01)] py-1 px-2 rounded-md'>Close</button>
              </div>
            </div>
          </DropDownBody>

        </>
      )}
    </DropdownContainer>

  )
}

export default GuestDropDown


