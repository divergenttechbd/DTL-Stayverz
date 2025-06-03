import { FC, useMemo, useRef } from 'react'
import { useDetectOutsideClick } from '~/hooks/useDetectOutsideClick'

type PriceBreakdownPopoverProps = {
  setOpen: Function
  data: any
}

const PriceBreakdownPopover:FC<PriceBreakdownPopoverProps> = ({setOpen, data}) => {
  const ref = useRef<HTMLDivElement>(null)
  useDetectOutsideClick(ref, setOpen(false), true)

  const displayList = useMemo(() => Object.keys(data?.price_info || {}).sort().map((key) =>
    <div key={key} className='flex justify-between my-2'>
      <div>{key}</div>
      <div>৳ {data?.price_info[key].price}</div>
    </div>
  ), [data?.price_info])
  
  return (
    <div className='absolute z-10 left-0 right-0 mt-2 w-60 sm:w-96 bg-white border rounded-lg shadow-2xl p-5 mb-5' ref={ref}>
      <div className='text-center font-semibold'>
        Base Price Breakdown
      </div>
      <hr className='mt-3 mb-5'/>
      {displayList}
      <hr className='mb-3 mt-5'/>
      <div className='flex justify-between my-2 font-semibold'>
        <div>Total Price</div>
        <div>৳ {data?.bookingPrice || data?.price}</div>
      </div>
    </div>
  )
}

export default PriceBreakdownPopover
