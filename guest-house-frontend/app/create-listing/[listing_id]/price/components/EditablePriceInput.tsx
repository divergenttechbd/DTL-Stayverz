import { CaretDown, CaretUp, PencilSimple } from '@phosphor-icons/react'
import React, { FC, useCallback, useMemo, useRef, useState } from 'react'
import { styles } from '~/styles/classes'

interface IEditablePriceInputProps {
  price: string;
  error: string;
  setPrice: Function;
  className?: string;
  guestServicePercent?: number | undefined;
  hostServicePercent?: number | undefined;
}

const EditablePriceInput: FC<IEditablePriceInputProps> = ({price, setPrice, error, className, guestServicePercent, hostServicePercent}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [showServiceCharge, setShowServiceCharge] = useState(false)

  const calculateServiceCharge = useMemo((() => {
    let basePrice = parseInt(price)
    let guestServiceCharge:number = parseFloat((basePrice * (guestServicePercent ?? 0)).toFixed(2))
    let hostServiceCharge:number = Math.round(basePrice * (hostServicePercent ?? 0))

    let guestPrice:number = basePrice+guestServiceCharge
    let hostEarn:number = basePrice-hostServiceCharge
    return {basePrice, guestPrice, hostEarn, guestServiceCharge}
  }),[price, guestServicePercent, hostServicePercent])
  const {basePrice, guestPrice, hostEarn, guestServiceCharge} = calculateServiceCharge

  const divRef = useRef<HTMLDivElement>(null)

  const onContentBlur = useCallback((evt: React.FocusEvent<HTMLDivElement>) => {
    setIsFocused(false)
  }, [])

  const onContentFocus = useCallback(() => {
    setIsFocused(true)
  }, [])

  const onIconClick = useCallback(() => {
    if (divRef.current) {
      setIsFocused(true)
      divRef.current.focus()
      const range = document.createRange()
      const sel = window.getSelection()
      range.selectNodeContents(divRef.current)
      range.collapse(false)
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
  }, [])

  const handleKeyDown = useCallback((e:any) => {
    if (
      !(e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Backspace' || e.key === 'Delete') && !(e.key <= '9' && e.key >= '0')
    ) {
      e.preventDefault()
    }
  }, [])

  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    if(divRef.current){
      let updatedPrice = e.currentTarget.textContent || ''

      // Check if the textContent is empty
      if (updatedPrice === '') {
        updatedPrice = '0'
        divRef.current.textContent = updatedPrice
      }
      // If the first character is "0", replace it with new input
      if (updatedPrice.length > 1 && updatedPrice[0] === '0') {
        updatedPrice = updatedPrice.slice(1)
      }

      divRef.current.textContent = updatedPrice
      setPrice(updatedPrice)
      const range = document.createRange()
      const sel = window.getSelection()
      range.selectNodeContents(divRef.current)
      range.collapse(false) 
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
  }, [setPrice])

  return (
    <>
      <div className={`flex flex-row text-[48px] font-bold relative items-center ${className} overflow-hidden`}>
        <div className='text-[45px]'>৳</div>
        <div
          ref={divRef}
          contentEditable
          onBlur={onContentBlur}
          suppressContentEditableWarning={true}
          onFocus={onContentFocus}
          className={`ml-1 pr-5 font-semibold outline-transparent bg-none bg-transparent relative`}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
        >
          {price}
        </div>
        <button
          className={`w-6 h-6 bg-white rounded-full outline outline-1 outline-grayBorder ${styles.flexCenter} ${isFocused && 'hidden'}`}
          onClick={onIconClick}
        >
          <PencilSimple size={12} weight='fill' />
        </button>
      </div>
      
      { 
        (guestServicePercent || hostServicePercent) &&
        showServiceCharge ? (
            <div className='mb-12 text-sm flex flex-col gap-3'>
              <div className='p-4 border-2 border-black rounded-xl'>
                <div className='flex justify-between w-full mb-2'>
                  <p>Base price</p>
                  <span>৳{basePrice}</span>
                </div>
                <div className='flex justify-between w-full mb-2'>
                  <p>Guest Gateway fee</p>
                  <span>৳{guestServiceCharge}</span>
                </div>
                <hr className='bg-grayBorder mb-4 mt-4'/>
                <div className='flex justify-between w-full font-semibold'>
                  <p>Total Guest price</p>
                  <span>৳{guestPrice}</span>
                </div>
              </div>
              <div className='flex justify-between p-4 border border-grayBorder rounded-xl font-semibold'>
                <p>You earn</p>
                <span>৳{hostEarn}</span>
              </div>
              <span className='flex justify-center items-center gap-1 cursor-pointer mt-10' onClick={() => setShowServiceCharge(false)}>Show less <CaretUp size={16}/></span>
            </div>
          ) : (
            <span 
              className='flex justify-center items-center gap-1 cursor-pointer mb-12 text-sm' 
              onClick={() => setShowServiceCharge(true)}>Guest price before taxes ৳{guestPrice} <CaretDown size={16}/></span>
          ) 
      }
      {error && <div className='flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1 mb-4'>
        {error}
      </div>}
    </>
  )
}

export default EditablePriceInput
