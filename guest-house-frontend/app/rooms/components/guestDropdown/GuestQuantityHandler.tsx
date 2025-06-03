'use client'
import { Minus, Plus } from '@phosphor-icons/react'
import React from 'react'
import { GuestCounts } from '~/app/rooms/components/guestDropdown/GuestDropDown'
import { styles } from '~/styles/classes'

type GuestQuantityHandlerType = {
  title: string
  subtitle: string
  guestKey: keyof GuestCounts
  disabled?: boolean
  guests: GuestCounts
  setGuestsNumber?: React.Dispatch<React.SetStateAction<GuestCounts>>
  adjustGuestCount?: (key: string, value: number) => void
  canIncrement: boolean
  className?: string,
}

const GuestQuantityHandler: React.FC<GuestQuantityHandlerType> = ({
  title,
  subtitle,
  guestKey,
  disabled = false,
  guests,
  setGuestsNumber,
  adjustGuestCount,
  canIncrement,
  className,
}) => {

  const buttonDefaultStyles = `hover:border-[#222222]  hover:text-[#202020]`
  const buttonDisabledStyles = `cursor-not-allowed opacity-[0.5]`

  const handleGuestIncrement = () => {
    if (setGuestsNumber) {
      setGuestsNumber(prevGuests => {
        const adultCount = prevGuests['adult']
        return ({
          ...prevGuests,
          [guestKey]: prevGuests[guestKey] + 1,
          ...(((guestKey ==='infant' || guestKey === 'children') && adultCount <= 0) && {'adult':1})
        })
      })
    } else {
      adjustGuestCount?.(guestKey, guests[guestKey] + 1)
    }

  }

  const handleGuestDecrement = () => {
    if (setGuestsNumber) {
      setGuestsNumber(prevGuests => ({
        ...prevGuests,
        [guestKey]: prevGuests[guestKey] > 0 ? prevGuests[guestKey] - 1 : 0,
      }))
    } else {
      adjustGuestCount?.(guestKey, guests[guestKey] > 0 ? guests[guestKey] - 1 : 0)
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className='flex justify-between items-center'>
        <div>
          <h4 className='text-[#202020] text-[16px] font-[600]'>{title}</h4>
          <p className='text-[#202020] text-[14px] font-[400]'>{subtitle}</p>
        </div>
        <div className='flex justify-between items-center gap-1'>
          <button
            disabled={guestKey === 'adult' ? guests[guestKey] <= 1 : guests[guestKey] <= 0 || disabled}
            onClick={handleGuestDecrement}
            className={`${styles.flexCenter} p-2 border rounded-full text-gray-600 ${guests[guestKey] <= 0 || disabled ? buttonDisabledStyles : buttonDefaultStyles}`}
          >
            <Minus size={16} className='hover:text-[#202020]' />
          </button>
          <div className={`w-[30px] ${styles.flexCenter}`}>
            <p className='text-[#202020] text-[16px] font-[400]'>{guests[guestKey]}</p>
          </div>
          <button
            disabled={(disabled || !canIncrement) && guestKey !== 'infant'}
            onClick={handleGuestIncrement}
            className={`${styles.flexCenter} p-2 border rounded-full text-gray-600 ${(disabled || !canIncrement) && guestKey !== 'infant' ? buttonDisabledStyles : buttonDefaultStyles}`}
          >
            <Plus size={16} className='hover:text-[#202020]' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default GuestQuantityHandler
