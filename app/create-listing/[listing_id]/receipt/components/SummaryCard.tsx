'use client'

import { Star } from '@phosphor-icons/react'
import Image from 'next/image'
import { FC } from 'react'
import { IOptionProps } from '~/components/form/inputs/multiSelectInput/MultiSelectInput'
import Modal from '~/components/modal/Modal'
import { useModal } from '~/components/modal/hooks/useModal'
import { formatPriceWithTime } from '~/lib/utils/formatter/priceFormatter'


interface SummaryCardProps {
  data: any;
  className?: string;
};

const SummaryCard: FC<SummaryCardProps> = ({
  data,
  className,
}) => {
  const [isModalOpen, handleModalOpen, handleModalClose] = useModal()
 
  return (

    <>
      <Modal 
        show={isModalOpen} 
        onClose={handleModalClose} 
        title='Full Preview' 
        modalContainerclassName='slide-in-bottom w-full sm:min-w-[56rem] sm:w-96 rounded-0 sm:rounded-md'
        titleContainerClassName='items-center justify-center gap-5 p-4 border-b'
        crossBtnClassName='absolute left-4 top-1/2 -translate-y-1/2'
        bodyContainerClassName='p-5 sm:p-6'
      >
        <div className={'flex flex-col sm:flex-row gap-2 col-span-1 group'}>
          <div className='aspect-square w-full sm:w-1/2 relative rounded-xl overflow-hidden'>
            {!!data?.cover_photo &&<Image
              fill
              className='object-cover h-full w-full sm:p-5 pb-0 rounded-xl'
              src={data?.cover_photo}
              alt='Listing'
            />}            
          </div>
          <div className='sm:w-1/2 overflow-scroll scrollbar-hidden overflow-x-auto max-h-[50vh]'>
            <h3 className='font-semibold text-[20px] sm:text-[32px] my-3'>{data.title}</h3>
            <h4 className='font-semibold text-[18px] sm:text-[22px] mb-3'>Place to stay in a rental unit hosted by {data.title}</h4>
            <p className='mb-5 font-normal text-[16px]'>{data.guest_count} guests, · {data.bedroom_count} bedroom, · {data.bed_count} bed, · {data.bathroom_count} bath</p>
            <hr className='mb-5'/>
            <p className='mb-5 font-normal text-[16px]'>{data.description}</p>
            <hr className='mb-5'/>
            {data.amenities?.length > 0 && <h4 className='mb-5 font-semibold text-[16px]'>Amenities</h4>}
            {data.amenities?.slice(0, 5).map(({amenity}:{amenity:IOptionProps}) => 
              <div key={amenity.name}>
                <div className='flex flex-row justify-between m-3'>{amenity.name} <Image src={`${amenity.icon}` as string} alt='' height={32} width={32}/></div>
                <hr/>
              </div>)}
            {data.amenities?.length > 5 && <><div className='text-[14px] m-3 text-gray-400'>+{data.amenities.length - 5} more</div><hr/></>}
            
            <h4 className='mb-5 mt-5 font-semibold text-[16px]'>Location</h4>
            <h4 className='mb-5 mt-5 font-normal text-[16px]'>{data?.address}</h4>
            <p className='mb-5 text-xs'>We’ll only share your address with guests who are booked as outlined in our privacy policy.</p>
          </div>
        </div>
      </Modal>
      <div className={`col-span-1 cursor-pointer group drop-shadow-lg bg-white rounded-xl ${className}`} onClick={handleModalOpen}>
        <div className='flex flex-col gap-2 w-full'>
          <div 
            className='aspect-square w-full relative rounded-xl overflow-hidden'
          >
            {!!data?.cover_photo && <Image
              fill
              className='object-cover h-full w-full p-5 pb-0 rounded-xl'
              src={data?.cover_photo}
              alt='Listing'
            />}
          
          </div>
          <div className='p-5 pt-2'>        
            <div className='flex flex-row items-center gap-1 justify-between'>
              <div className='font-semibold'>
                {data.title}
              </div>
              <div className='font-semibold flex flex-row justify-center items-center'>
              New <Star  weight='fill' size={16} />
              </div>
            </div>
            <div className='font-semibold'>
            $ {formatPriceWithTime(data.price, 'Night')}
            </div>
          </div>
        </div>
      </div>
    </>
    
  )
}

export default SummaryCard
