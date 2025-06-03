import { Dayjs } from 'dayjs'
import { FC } from 'react'
import { DAYS } from '~/app/home/constant/days'
import { DateRange, Week } from '~/hooks/calendar/useHomeCalendar'
import { styles } from '~/styles/classes'

export type MonthProps = {
  monthData: any
  inSelectedRange: Function
  isPrevious: Function
  isSelecting: boolean
  handleMouseClick: Function
  handleMouseEnter: Function
  selectedRange: DateRange
}


const Month: FC<MonthProps & { some?: boolean }> = ({ monthData, handleMouseEnter, inSelectedRange, selectedRange, isSelecting, isPrevious, handleMouseClick, some }) => {
  const draggingStyle = 'bg-gray-100 '
  const selectedStyle = 'bg-[#F15927] text-[#ffffff]'

  return monthData ? (
    <div key={monthData.month} className='sm:my-5'>
      <div className='w-full flex  mx-auto'>
        {DAYS.map(d => (
          <div key={d} className={`
            ${styles.flexCenter}
            mx-auto 
            w-[35px] h-[35px] 
            sm:w-[40px] sm:h-[40px] 
            sm:px-[10px] py-2 color-white box-border bg-white mb-1 text-[12px] text-[#717171] font-[700]`}>
            {d}
          </div>
        ))}
      </div>
      <div>
        <div className='w-full flex flex-col' id={`${monthData.month}_${monthData.year} `}>
          {monthData.weeks.map((week: Week, week_index: number) => {
            return (
              <div key={week_index} className={`flex ${week_index === 0 ? '' : ' grow'} ${week_index === monthData.totalWeeks - 1 ? '' : 'grow'}`}>
                {
                  week.map((day: (Dayjs | null), day_index: number) => {
                    const isMarginal = (selectedRange.startDate && selectedRange.startDate?.format('DD-MM-YYYY') === day?.format('DD-MM-YYYY')) || (selectedRange.endDate && selectedRange.endDate?.format('DD-MM-YYYY') === day?.format('DD-MM-YYYY'))
                    const isInSelectedRange = inSelectedRange(day)
                    const previous = isPrevious(day)

                    return (
                      <button
                        type='button'
                        key={`${week_index} ${day_index}`}
                        disabled={previous}
                        className={`flex justify-center items-center grow xs:flex-auto p-[1px]  basis-0 select-none cursor-pointer
                        color-white box-border
                        disabled:cursor-not-allowed disabled:text-gray-400 disabled:line-through
                        ${day ? '' : 'opacity-0'} 
                        ${isInSelectedRange ? isMarginal ? '' : draggingStyle : ''} 
                      `}
                        onMouseEnter={handleMouseEnter(day)}
                        onClick={handleMouseClick(day)}
                      >
                        <div className={` 
                        ${styles.flexCenter} 
                        ${(isInSelectedRange && isMarginal) ? selectedStyle : 'text-[#202020] '} 
                        w-[35px] h-[35px] 
                        sm:w-[40px] sm:h-[40px] rounded-full border border-transparent hover:border-[#F15927]`}>
                          <p className='text-[12px] sm:text-[14px] font-[600]'>{day?.get('D') || '-'}</p>
                        </div>
                      </button>)
                  })
                }
              </div>
            )
          })}
        </div>
      </div>
    </div>
  ) : null
}

export default Month
