'use client'
import { CaretRight } from '@phosphor-icons/react'
import { CheckCircle } from '@phosphor-icons/react/dist/ssr/CheckCircle'
import { XCircle } from '@phosphor-icons/react/dist/ssr/XCircle'
import { useEffect, useState } from 'react'
import { formatTime } from '~/lib/utils/formatter/dateFormatter'

const convertToDateStr = (value: string) => {
  let timeStr = value

  // Split the time string into hours, minutes, and seconds
  let timeParts = timeStr.split(':')
  let hours = parseInt(timeParts[0])
  let minutes = parseInt(timeParts[1])
  let seconds = parseInt(timeParts[2])

  // Create a new Date object and set the time components
  let time = new Date()
  time.setHours(hours)
  time.setMinutes(minutes)
  time.setSeconds(seconds)

  // return time time in Date format
  return time
  
}


interface ThingState {
  allowed: string[];
  disallowed: string[];
  unmarriedCouple: boolean;
}

const initialState: ThingState = {
  allowed: [],
  disallowed: [],
  unmarriedCouple: false
}

const ThingsToKnow: React.FC<any> = ({ data })=> {
  const [permittedThings, setPermittedThings] = useState<ThingState>(initialState)

  useEffect(() => {
    const handleSetPermittedThings = () => {

      const newData: ThingState = {
        allowed: [],
        disallowed: [],
        unmarriedCouple: false
      }

      // This logic is depended on backend data key pattern, which is 'something_allowed'. This is not a sustainable solution. This need to be simplified.
      // Now, for quick fix another logic is added here for 'unmarried_couples_allowed'
      Object.keys(data).forEach(key => {
        if(key.split('_')[1] === 'allowed'){
          const itemName = key.split('_')[0]
          const capitalizeItemName = itemName.split('').map((text, index) => index === 0 ? text.toLocaleUpperCase() : text).join('')
          if(data[key] === true) {
            !newData['allowed'].includes(itemName) && newData['allowed'].push(newData['allowed'].length === 0 ? capitalizeItemName : itemName)
          } else {
            !newData['disallowed'].includes(itemName) && newData['disallowed'].push(newData['disallowed'].length === 0 ? capitalizeItemName : itemName)
          }
        } 
        if(key.split('_')[1] === 'couples'){
          newData['unmarriedCouple'] = data[key]
        }
      })

      setPermittedThings(newData)
    }

    handleSetPermittedThings()
  },[data])


  return (
    <div className={`w-full py-5 sm:py-10`}>
      <div className='px-5 xl:px-0 xl:container sm:pb-0'>
        <div className='space-y-5'>
          <h2 className='text-3xl font-semibold text-[#202020] leading-10 md:text-4xl md:font-medium md:leading-10 '>
          Need to know
          </h2>
          <div className='flex flex-col xl:flex-row gap-y-10 p-5 md:p-8 bg-[#FBFCFC] rounded-[12px] border border-[#EFEFEF]'>
            {/* ITEM ONE */}
            <div className='w-full pb-9 xl:pb-0 border-b xl:border-b-0 border-r-0 xl:border-r space-y-4'>
              <p className='text-[#202020] text-lg font-medium leading-7 md:text-2xl md:font-semibold md:leading-8'>House rules</p>
              <p className='text-[#616161] md:text-[#202020] text-sm font-normal leading-5 tracking-normal text-left md:text-lg md:font-normal md:leading-7 flex justify-start items-start gap-2'> 
                <CheckCircle size={22} weight='fill'  className='text-[#ffffff] h-[18px] md:h-[22px] md:mt-[2px] flex-none' color='#FC8E6A'/>
                <span className=''>Check-in { formatTime(convertToDateStr(data?.check_in))}</span>
              </p>
              <p className='text-[#616161] md:text-[#202020] text-sm font-normal leading-5 tracking-normal text-left md:text-lg md:font-normal md:leading-7 flex justify-start items-start gap-2'> 
                <CheckCircle size={22} weight='fill'  className='text-[#ffffff] h-[18px] md:h-[22px] md:mt-[2px] flex-none' color='#FC8E6A'/>
                <span className=''>Checkout {formatTime(convertToDateStr(data?.check_out))}</span>
              </p>
              <p className='text-[#616161] md:text-[#202020] text-sm font-normal leading-5 tracking-normal text-left md:text-lg md:font-normal md:leading-7 flex justify-start items-start gap-2'> 
                <CheckCircle size={22} weight='fill'  className='text-[#ffffff] h-[18px] md:h-[22px] md:mt-[2px] flex-none' color='#FC8E6A'/>
                <span className=''>{data?.guest_count || 0}  guests maximum</span>
              </p>
              <button className='text-[#202020] text-[16px] font-[700] flex justify-start items-center gap-1 !hidden'>
                <span className='underline'>Show More</span>
                <CaretRight size={16} />
              </button>
            </div>
            {/* ITEM TWO */}
            <div className='w-full pb-9 xl:pb-0 border-b xl:border-b-0 border-r-0 xl:border-r space-y-4 xl:px-10'>
              <p className='text-[#202020] text-lg font-medium leading-7 md:text-2xl md:font-semibold md:leading-8'>Allowable things</p>
            
              {permittedThings['allowed'].length > 0 &&   
              <p className='text-[#616161] md:text-[#202020] text-sm font-normal leading-5 tracking-normal text-left md:text-lg md:font-normal md:leading-7 flex justify-start items-start gap-2'> 
                <CheckCircle size={22} weight='fill'  className='text-[#ffffff] h-[18px] md:h-[22px] md:mt-[2px] flex-none' color='#FC8E6A'/>
                <span className=''>
                  {
                    permittedThings['allowed'].join(', ')
                  } {permittedThings['allowed'].length <= 1 ? 'is' : 'are'} allowed
                </span>
              </p>}
            

              {permittedThings['disallowed'].length > 0 &&    
              <p className='text-[#616161] md:text-[#202020] text-sm font-normal leading-5 tracking-normal text-left md:text-lg md:font-normal md:leading-7 flex justify-start items-start gap-2'> 
                <XCircle  size={22} weight='fill'  className='text-[#ffffff] h-[18px] md:h-[22px] md:mt-[2px] flex-none' color='#FC8E6A'/>
                <span className=''>{permittedThings['disallowed'].join(', ')} {permittedThings['disallowed'].length <= 1 ? 'is' : 'are'} not allowed</span>
              </p>}

              {/* For unmarried couple house rule */}
              {
                permittedThings['unmarriedCouple'] ? '' 
                  :
                  <p className='text-[#616161] md:text-[#202020] text-sm font-normal leading-5 tracking-normal text-left md:text-lg md:font-normal md:leading-7 flex justify-start items-start gap-2'> 
                    <XCircle  size={22} weight='fill'  className='text-[#ffffff] h-[18px] md:h-[22px] md:mt-[2px] flex-none' color='#FC8E6A'/>
                    <span className=''>Unmarried couples are not allowed</span>
                  </p>
              }
        


              <button className='text-[#202020] text-[16px] font-[700]  flex justify-start items-center gap-1 !hidden'>
                <span className='underline'>Show More</span>
                <CaretRight size={16} />
              </button>
            </div>
            {/* ITEM THREE */}
            <div className='w-full pb-9 sm:pb-0 space-y-4 xl:pl-10'>
              <p className='text-[#202020] text-lg font-medium leading-7 md:text-2xl md:font-semibold md:leading-8'>Cancellation policy</p>
              <p className='text-[#616161] md:text-[#202020] text-sm font-normal leading-5 tracking-normal text-left md:text-lg md:font-normal md:leading-7 flex justify-start items-start gap-2'> 
                <CheckCircle  size={22} weight='fill'  className='text-[#ffffff] h-[18px] md:h-[22px] md:mt-[2px] flex-none' color='#FC8E6A'/>
                <span className=''>Cancellation policy is {data?.cancellation_policy?.policy_name}</span>
              </p>
              <p className='text-[#616161] md:text-[#202020] text-sm font-normal leading-5 tracking-normal text-left md:text-lg md:font-normal md:leading-7 flex justify-start items-start gap-2'> 
                <CheckCircle  size={22} weight='fill'  className='text-[#ffffff] h-[18px] md:h-[22px] md:mt-[2px] flex-none' color='#FC8E6A'/>
                <span className=''>{data?.cancellation_policy?.description}</span>
              </p>
              <p className='text-[#616161] md:text-[#202020] text-sm font-normal leading-5 tracking-normal text-left md:text-lg md:font-normal md:leading-7 flex justify-start items-start gap-2'> 
                <CheckCircle  size={22} weight='fill'  className='text-[#ffffff] h-[18px] md:h-[22px] md:mt-[2px] flex-none' color='#FC8E6A'/>
                <span className=''>Refund protection by Stayverz</span>
              </p>
              {/* <p className='text-[#202020] text-[16px] font-[400]'>Free cancellation for 48 hours.</p>
              <p className='text-[#202020] text-[16px] font-[400]'>
              Review the Host’s full cancellation policy which applies even if you cancel for illness or disruptions caused by COVID-19.
              </p> */}
              <button className='text-[#202020] text-[16px] font-[700] flex justify-start items-center gap-1 !hidden'>
                <span className='underline'>Show More</span>
                <CaretRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThingsToKnow


