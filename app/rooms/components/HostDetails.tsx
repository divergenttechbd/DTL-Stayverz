'use client'
import { CaretRight, ShieldCheck, Star } from '@phosphor-icons/react'
import { Translate } from '@phosphor-icons/react/dist/ssr/Translate'
import { truncate } from 'lodash'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import Avatar from '~/components/Images/Avatar'
import Button from '~/components/layout/Button'
import { DATE_FORMAT } from '~/constants/format'
import { removeEmptyValue } from '~/lib/utils/object'
import { getAsQueryString } from '~/lib/utils/url'
import PropertyVerifiedImg from '~/public/images/property/property-verfied.png'
import { useAuthStore } from '~/store/authStore'
import { styles } from '~/styles/classes'

const getJoiningDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = date.getMonth()
  const monthName = date.toLocaleString('default', { month: 'short' })
  const day = date.getDay()

  return `${day} ${monthName} ${year}`
}

const HostDetails: React.FC<any> = (props) => {

  const { selectedRange, data } = props

  const { unique_id: roomId } = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  // const handleContactHost = useCallback(() => {
  //   if (isAuthenticated) router.push(`/rooms/contact-host/${roomId}`)
  //   else useAuthStore.setState({authFlow: 'GUEST_LOG_IN', authFlowSuccessRedirect: `/rooms/contact-host/${roomId}`})
  // }, [router, roomId, isAuthenticated])

  const handleContactHost = useCallback(() => {
    const dateParams = {
      check_in: selectedRange?.startDate?.format(DATE_FORMAT) || null, /* YYYY-MM-DD */
      check_out: selectedRange?.endDate?.format(DATE_FORMAT) || null, /* YYYY-MM-DD */
    }
    const query = getAsQueryString(removeEmptyValue(dateParams))

    if (isAuthenticated) router.push(`/rooms/contact-host/${roomId}${query}`)
    else useAuthStore.setState({authFlow: 'GUEST_LOG_IN', authFlowSuccessRedirect: `/rooms/contact-host/${roomId}${query}`})
  }, [router, roomId, isAuthenticated,selectedRange])

  const [showFullReview, setShowFullReview] = useState(data?.host?.bio?.length < 100)
  const handleToggle = useCallback(() => {
    setShowFullReview(prev => !prev)
  }, []) 

  return (
    <div className='px-5 xl:px-0 xl:container'>
      <div className={`w-full pt-5`}>
        <div className='space-y-5'>
          <div className='space-y-2'>
            <div className='w-full flex justify-start items-center gap-3'>
              <div className='border-[2px] rounded-full min-w-[45px] max-w-[45px] min-h-[45px] max-h-[45px] flex justify-center items-center overflow-hidden'>
                {data?.host?.image ?
                  <Image
                    src={data?.host?.image}
                    alt='profile-image'
                    width={55}
                    height={55}
                    className='object-cover w-[45px] h-[45px]'
                  />
                  : <Avatar />}
              </div>
              <div className='space-y-2'>
                <div className='flex justify-start items-center gap-2'>
                  <h2 className='text-lg font-medium leading-7 md:text-xl md:font-medium md:leading-7 text-[#202020]'>Hosted by  <Link className='' href={`/user/${data?.host?.id}`}>{data?.host?.full_name}</Link></h2>
                  <span className={`md:mt-1 ${data?.host?.identity_verification_status === 'verified' ? `${styles.flexCenter}` : 'hidden'}`}>
                    <Image src={PropertyVerifiedImg} width={19} height={19} alt='property-verified' className='min-w-[19px] max-w-[19px] min-h-[19px] max-h-[19px]'/> 
                  </span>
                </div>
                <div className='hidden md:flex justify-start items-center gap-3 md:gap-5 flex-wrap'>
                  <div className='flex justify-start items-center gap-1'>
                    <ShieldCheck size={20} color='#2F80ED'/>
                    <p className='text-sm font-medium leading-5 text-[#616161] whitespace-nowrap'>Joined in {getJoiningDate(data?.host?.date_joined || '')}</p>
                  </div>
                  <div className='flex justify-start items-center gap-1'>
                    <Star size={20} color='#FFA412' weight='fill'/>
                    <p className='text-sm font-medium leading-5 text-[#616161] whitespace-nowrap'>{data?.total_rating_count || 0} Reviews</p>
                  </div>
                  <div className='flex justify-start items-center gap-1'>
                    <Translate size={20} color='#2F80ED'/>
                    <p className='text-sm font-medium leading-5 text-[#616161] whitespace-nowrap'>{data?.host?.languages.join(', ')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex md:hidden justify-start items-center gap-3 md:gap-5 flex-wrap'>
              <div className='flex justify-start items-center gap-1'>
                <ShieldCheck size={20} color='#2F80ED'/>
                <p className='text-sm font-medium leading-5 text-[#616161] whitespace-nowrap'>Joined in {getJoiningDate(data?.host?.date_joined || '')}</p>
              </div>
              <div className='flex justify-start items-center gap-1'>
                <Star size={20} color='#FFA412' weight='fill'/>
                <p className='text-sm font-medium leading-5 text-[#616161] whitespace-nowrap'>{data?.total_rating_count || 0} Reviews</p>
              </div>
              <div className='flex justify-start items-center gap-1'>
                <Translate size={20} color='#2F80ED'/>
                <p className='text-sm font-medium leading-5 text-[#616161] whitespace-nowrap'>{data?.host?.languages?.join(', ')}</p>
              </div>
            </div>
          </div>
          <div className='md:pb-5'>
            {/* SECTION */}
            {data?.host?.bio 
            &&
              <p className='text-[#616161] text-base font-normal leading-6 lg:w-[570px]'>
                {showFullReview ? data?.host?.bio : truncate(data?.host?.bio, {'length': 100})}
                {!showFullReview &&  
                <button onClick={handleToggle} 
                  className='mt-3 text-sm text-[#202020] font-medium leading-5 md:text-base md:font-medium md:leading-6  flex justify-start items-center gap-1'>
                  <span className=''>Show More</span>  <CaretRight size={16}/>
                </button> }
              </p>
            }
          </div>

          <div className='space-y-5'>
            {/* <p className='text-[#202020] text-[16px] font-[400]'>Response rate: 99%</p> */}
            {/* <p className='text-[#202020] text-[16px] font-[400]'>Response time: within an hour</p> */}
            <Button
              label='Contact Host'
              variant='outlined'
              onclick={handleContactHost}
              className='!text-[#f66c0e] !border-[#f66c0e] hover:!bg-[#f66c0e] hover:!text-[#ffffff]'
            />
            <div className='lg:w-[570px] flex justify-start items-center gap-3'>
              <div className={`${styles.flexCenter}`}>
                <ShieldCheck size={22} color='rgb(255,0,0)' />
              </div>
              {/* <p className='text-[#202020] text-[12px] font-[400] leading-5'>To protect your payment, never transfer money or communicate outside of the Stayverz website or app.</p> */}
              <p className='text-[#616161]  text-sm font-normal leading-5 tracking-normal'>To protect your payment, never transfer money or communicate outside of the Stayverz website or app.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HostDetails


