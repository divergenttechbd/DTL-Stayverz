'use client'
import Image from 'next/image'
import { FC } from 'react'
import { DropdownContainer, DropDownHead } from '~/app/rooms/components/guestDropdown/CustomDropDown'
import RoomDateRange from '~/app/rooms/components/RoomDateRange'
import { DateRangeWithRoomDataTypes } from '~/app/rooms/components/RoomDetails'
import { DATE_FORMAT_MM_DD } from '~/constants/format'
import { styles } from '~/styles/classes'

import CheckInImg from '~/public/images/location-filter/check-in.png'
import CheckOutImg from '~/public/images/location-filter/checkout.png'


const DateRangeDropdown:FC<DateRangeWithRoomDataTypes> = ({
  selectedRange,
  setSelectedRange,
  isSelecting,
  isPrevious, 
  resetSelected, 
  data, 
  handleMouseEnter, 
  inSelectedRange,
  generateDataByMonth,
  handleMouseClick
}) => {


  const clearDates = () => {
    resetSelected()
  }

  return (
    <DropdownContainer>
      {(props) => (
        <>
          <DropDownHead {...props}>

            {/* DATE PICKER */}
            <div className='flex border-b'>
              <button className='p-2 relative w-full cursor-pointer border-r flex justify-start items-center gap-3'>
                <div 
                  className={`w-[30px] h-[30px] ${styles.flexCenter} rounded-full bg-[#E7FFF5] shadow-[0px,0.75px,1.5px,0px,#9799C93D]`} 
                >
                  <Image src={CheckInImg} width={12} height={12} className='w-auto h-[12px]' alt=''/> 
                </div>
                <div className='flex flex-col justify-start items-start gap-1'>
                  <p className='text-[#9C9C9C]  uppercase text-xs font-medium leading-4'>Check-In</p>
                  <p className='text-[#202020] text-base font-medium leading-6'>{selectedRange.startDate ? selectedRange?.startDate?.format(DATE_FORMAT_MM_DD) : 'Add Dates'}</p>
                </div>
              
              </button>
              <button className='p-2 relative w-full cursor-pointer flex justify-start items-center gap-3'>
                <div 
                  className={`w-[30px] h-[30px] ${styles.flexCenter} rounded-full bg-[#FFF4E1] shadow-[0px,0.75px,1.5px,0px,#9799C93D]`} 
                >
                  <Image src={CheckOutImg} width={12} height={12} className='w-auto h-[12px]' alt=''/> 
                </div>
                <div className='flex flex-col justify-start items-start gap-1'>
                  <p className='text-[#9C9C9C]  uppercase text-xs font-medium leading-4'>Checkout</p>
                  <p className='text-[#202020] text-base font-medium leading-6'>{selectedRange.endDate ?  selectedRange?.endDate?.format(DATE_FORMAT_MM_DD) : 'Add Dates'}</p>
                </div>
              </button>
            </div>
          
          </DropDownHead>
          <div id='custom-dropdown' className={`absolute z-10 top-[50px] right-0 mx-auto ${props.show ? 'block' : 'hidden'} w-[650px]`}>
            <div className='bg-[#ffffff] border rounded-sm px-4 py-5 shadow-md w-full h-full'>
              <div className='w-full '>
                <RoomDateRange   
                  selectedRange={selectedRange}
                  setSelectedRange={setSelectedRange}
                  isSelecting={isSelecting}
                  isPrevious={isPrevious}
                  resetSelected={resetSelected}
                  handleMouseEnter={handleMouseEnter}
                  inSelectedRange={inSelectedRange}
                  generateDataByMonth={generateDataByMonth}
                  handleMouseClick={handleMouseClick}
                  data={data}
                />
                <div className='flex justify-end items-center gap-3'>
                  <button onClick={clearDates} className='font-[500] text-[14px] text-[#202020] underline py-2'>Clear Dates</button>
                  <button onClick={props.handleClose} className='text-[#ffffff] bg-[#F15927] text-[14px] font-[600] px-6 py-[7px] border rounded-lg w-full sm:w-auto'>Close</button>
                </div>
              </div>
            </div>
          </div>

        </>
      )}
    </DropdownContainer>

  )
}

export default DateRangeDropdown


