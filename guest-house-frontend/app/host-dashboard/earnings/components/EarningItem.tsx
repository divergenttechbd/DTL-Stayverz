'use client'
import { CaretDown } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import startCase from 'lodash/startCase'
import { FC, useCallback, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import useWindowSize from '~/hooks/useWindowSize'
import { getEarningDetails } from '~/queries/client/earnings'

type EarnintItemProps = {
  earning: IEarning
  onReservationClick: Function
}

const EarningItem:FC<EarnintItemProps> = ({earning, onReservationClick}) => {
  const {isMobileView} = useWindowSize()
  const [expanded, setExpanded] = useState(false)

  const handleExpaneded = useCallback((val:boolean) => () => {
    setExpanded(val)
  }, [])

  const { data:earningDetails, isFetching } = useQuery({
    queryKey: ['earningDetails', earning],
    queryFn: () => getEarningDetails({params: {id: earning.invoice_no}}),
    enabled: expanded,
    refetchOnWindowFocus: false
  })
  
  return (
    <div className='border-b p-5'>
      <div className='flex justify-between items-start'>
        <div className='flex items-center gap-3'>
          <div>
            <div className='flex items-center'>
              <h5 className='font-semibold text-normal'>{dayjs(earning?.payment_date).format('MMM DD, YYYY')}</h5>
              {earning?.status === 'paid' && <span className='text-xs ms-4 p-1 bg-gray-200 rounded-md border font-semibold'>Paid</span>}
            </div>
            <p className='text-sm mt-2'>{startCase(earning.pay_method.m_type)}, {earning.pay_method.account_name}, {earning.pay_method.account_no}</p>
          </div>
        </div>
        <div 
          className='flex gap-2 items-center'
          onClick={handleExpaneded(!expanded)} >
          <p className='cursor-pointer font-semibold text-[#f66c0e] whitespace-nowrap text-[12px] sm:text-[16px]'>৳ 
            <span className='underline'>{earning.total_amount}</span>
          </p>
          <CaretDown 
            size={isMobileView ? 14 :  20} 
            weight='bold' 
            className={`text-[#f66c0e] cursor-pointer transition-all duration-300 ${expanded ? 'rotate-180' : ''}`} 
          /> 
              
        </div>
      </div>

      <CSSTransition in={expanded} classNames='transition-fade' timeout={300} mountOnEnter unmountOnExit><div className='space-y-5'>
        <div className='mt-5 flex flex-col gap-2'>
          {earningDetails?.data?.map((details:any) => <div className='flex justify-between' key={details.id}>
            <p className='text-[12px] sm:text-[16px]'>Reservation <span onClick={onReservationClick(details?.invoice_no)} className='cursor-pointer underline font-semibold text-[#f66c0e]'>{details?.reservation_code}</span></p>
            <p className='text-[12px] sm:text-[16px]'>৳{details.amount}</p>
          </div>)}
        </div>
        <hr className='hidden sm:block'/>
        <div className='hidden sm:flex justify-between'>
          <p>Payout Method</p>
          <p>{startCase(earning.pay_method.m_type)}, {earning.pay_method.account_name}, {earning.pay_method.account_no}</p>
        </div>
      </div>
      </CSSTransition>
    </div>
  )
}

export default EarningItem
