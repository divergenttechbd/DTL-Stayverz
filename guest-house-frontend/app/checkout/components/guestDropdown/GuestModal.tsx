'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import { GuestCounts } from '~/app/rooms/components/guestDropdown/GuestDropDown'
import GuestQuantityHandler from '~/app/rooms/components/guestDropdown/GuestQuantityHandler'
import Button from '~/components/layout/Button'
import Modal from '~/components/modal/Modal'
import { getAsQueryString, getObjectFromSearchParams } from '~/lib/utils/url'

type GuestMetaType = {
  title: string
  subtitle: string
  guestKey: keyof GuestCounts
  disabled?: boolean
}

type GuestModalProps = {
  maxGuests: number
  onClose: () => void
  showModal: boolean
  defaultValue: GuestCounts
}

const GuestModal:FC<GuestModalProps> = ({maxGuests, showModal, onClose, defaultValue}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [guests, setGuestsNumber] = useState<GuestCounts>({ adult: 1, children: 0, infant: 0, pets: 0 })

  const guestMeta: GuestMetaType[] = [
    { title: 'Adults', subtitle: 'Ages 13+', guestKey: 'adult', disabled: false },
    { title: 'Children', subtitle: 'Ages 2–12', guestKey: 'children', disabled: false },
    { title: 'Infants', subtitle: 'Under 2', guestKey: 'infant', disabled: false },
  ]

  const handleReset = () => {
    setGuestsNumber({ adult: 1, children: 0, infant: 0, pets: 0 })
  }

  const handleSubmit = () => {
    router.push(`${pathname}${getAsQueryString({
      ...getObjectFromSearchParams(searchParams),
      ...guests
    })}`)
    onClose()
  }

  useEffect(() => {
    setGuestsNumber(defaultValue)
  }, [defaultValue])


  return (
    <Modal
      show={showModal}
      onClose={onClose}
      modalContainerclassName='lg:w-1/3 w-[95%] h-auto rounded-2xl '
      crossBtnClassName='ml-4 mt-5'
      bodyContainerClassName='max-h-[80vh] overflow-y-scroll scrollbar-hidden'
      header={<h4 className='text-2xl font-semibold mb-2'>Guests</h4>}
      subHeader={<h4 className='text-2xl font-semibold mb-2'>This place has a maximum of {maxGuests} guests</h4>}
    >   
      <div className='space-y-5 px-5 sm:px-10 mb-10'>
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
        <div className='flex gap-2 justify-end'>
          <div className='flex justify-end items-center'>
            <Button onclick={handleSubmit} label='Save' type='button' variant='dark' />
          </div>
        </div>
      </div>
    </Modal>

  )
}

export default GuestModal


