import { FC, useCallback } from 'react'
import { DateRangeTypes } from '~/app/checkout/components/RoomDetails'
import HomeFilterDateRange from '~/app/home/components/calendar/HomeFilterDateRange'
import { dropdownBaseStyles } from '~/app/home/hooks/useAnyWhereSearchMeta'
import { styles } from '~/styles/classes'

interface DateRangeDropdownnProps extends DateRangeTypes {
  setActiveSearchTab:Function
  resetSelected:Function
  className:string
}

const DateRangeDropdown:FC<DateRangeDropdownnProps> = (props)=> {
  const { resetSelected,className} = props

  const handleDateReset = useCallback(() => {
    resetSelected()
  },[resetSelected])

  return (
    <div className={`${dropdownBaseStyles} ${className || 'w-full left-0 right-0 px-5'}`}>
      <div className={`${styles.flexCenter} mt-2`}>
        <HomeFilterDateRange
          {...props}
        />
      </div>
      <div className='flex justify-end items-center gap-3'>
        <button onClick={handleDateReset} className='font-[500] text-[14px] text-[#222222] underline py-2'>Clear Dates</button>
      </div>
    </div>
  )
}

export default DateRangeDropdown
