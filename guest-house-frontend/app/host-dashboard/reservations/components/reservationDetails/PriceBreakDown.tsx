import dayjs from 'dayjs'
import { FC, useMemo, useState } from 'react'
import { IPriceInfo } from '~/app/host-dashboard/reservations/types'

interface IPriceBreakDownProps {
  priceInfo?: IPriceInfo
}
const PriceBreakDown:FC<IPriceBreakDownProps> = ({ priceInfo }) => {
  const [showBreakDown, setShowBreakDown] = useState(false)

  const renderedPrices = useMemo(() => {
    return Object.entries(priceInfo || {}).map(([date, details]) => (
      <div key={date} className='flex justify-between'>
        <p className='text-sm text-grayText'>{dayjs(date).format('MMM D, YYYY')}</p>
        <p className='text-sm text-grayText'>৳{details?.price}</p>
      </div>
    ))
  }, [priceInfo])
  return (
    <>    
      <p className={`${showBreakDown ? 'hidden':'block'} underline cursor-pointer text-sm font-semibold`} onClick={() => setShowBreakDown(true)}>Show BreakDown</p>
      <div className={`${showBreakDown ? 'block':'hidden'}`}>
        {renderedPrices}
        <p className='underline cursor-pointer text-sm font-semibold' onClick={() => setShowBreakDown(false)}>Collapse BreakDown</p>
      </div>
    </>
  )
}

export default PriceBreakDown
