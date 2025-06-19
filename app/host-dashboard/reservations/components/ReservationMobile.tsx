import { CaretRight } from '@phosphor-icons/react/dist/ssr/CaretRight'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { FC, useCallback, useMemo } from 'react'
import Loader from '~/components/loader/Loader'
import { Query } from '~/queries/types'

type ReservationMobileProps = {
  eventType:string
  fetchData: Query
  handleOpenModal: Function
  fetchDataPayload?: Parameters<Query>[0]

}

const ReservationMobile: FC<ReservationMobileProps>  = ({eventType, fetchData, handleOpenModal ,fetchDataPayload}) => {

  const fetchDataOptions = useMemo(() =>({
    page:  1,
    page_size: 0,
  }),[])

  const { data:dataQuery, isLoading } = useQuery({ 
    queryKey: ['data', fetchDataOptions, fetchDataPayload, fetchDataPayload?.params], 
    queryFn: () => fetchData({ ...fetchDataPayload, params: {...fetchDataPayload?.params,...fetchDataOptions}, })
  })

  const handleModal = useCallback((cellValue:number|string, modalType:string) => {
    return () => {
      handleOpenModal(cellValue, modalType)
    }
  },
  [handleOpenModal] )
  
 


  return (
    <div className='pb-[50px] sm:pb-5'>
      {isLoading ? 
        <div className='h-[60vh]'>
          <Loader />
        </div> 
        : 
        <div  className='mt-5 w-full px-3 space-y-5'>
          {dataQuery?.data?.map((item:any, index:number) => (
            <div 
              key={index} 
              className={`h-full flex justify-between items-start overflow-hidden pb-3 ${dataQuery?.data?.length - 1 !== index ? 'border-b' : ''}`}>
              <div className='flex-1'>
                <p className='font-semibold text-[#222222] text-[14px] ellipsis-one-line'>{item?.listing?.title}</p>
                <p className='font-medium text-[#222222] text-[12px] ellipsis-one-line'>{dayjs(item?.created_at).format('MMM D, YYYY')}</p>
                <p className='font-medium text-[#222222] text-[12px] ellipsis-one-line'>{item?.guest_count} guests . ৳{item?.host_pay_out}</p>
                {eventType === 'completed' && 
               <button onClick={handleModal(item?.invoice_no, 'review')} className='font-medium text-[#222222] text-[12px] underline mt-3'>Reivew</button>} 
              </div>
              <div onClick={handleModal(item?.invoice_no, 'details')} className='h-full pb-[50px] cursor-pointer flex-[0.7] flex justify-end items-center'>
                <CaretRight size={16} fill='#222222' className='h-full'/>
              </div>
            </div>
          ))}
        </div>}

     
    </div>
  )
}

export default ReservationMobile
