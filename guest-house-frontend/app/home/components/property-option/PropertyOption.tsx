'use client'
import Image from 'next/image'
import { useCallback, useState } from 'react'
import BookSecured from '~/public/images/property-options/book__secured2.svg'
import BookSupport from '~/public/images/property-options/book__support2.svg'
import BookVisual from '~/public/images/property-options/book__visual2.svg'
import PropertyCurveBg from '~/public/images/property-options/choose-property-bg.png'
import HostDamage from '~/public/images/property-options/host__damage2.svg'
import HostRefer2 from '~/public/images/property-options/host__refer2.svg'
import HostRock from '~/public/images/property-options/Host__rock2.svg'

import { styles } from '~/styles/classes'

const propertyType = [
  {
    key: 'host_property',
    label: 'Host Property',
    active: true
  },
  {
    key: 'book_property',
    label: 'Book Property',
    active: false
  },
]

const PropertyOption = () => {

  const [activeProperty, setActiveProperty] = useState('host_property')

  const handlePropertyOptionClick = useCallback((value:string) => () => setActiveProperty(value), [])

  return (
    <section className='stayverz-choose-option py-8 md:py-16 md:pt-0 lg:pb-[100px] relative z-[1]'>
      <div className={`xl:container px-4 xl:px-0`}>
        <div className='w-full space-y-[30px]'>
          {/* ===================== SECTION HEADER =============== */}
          <div className={`stayverz-section-header space-y-[8px] md:space-y-[15px]`}>
            <div className={`${styles.flexCenter}`}>
              <h2 className='text-3xl font-semibold text-[#202020] leading-10 md:text-4xl md:font-bold md:leading-10 text-center'>Select The Option That Suits <br className='hidden md:block'/> Your Requirements </h2>
            </div>
            <div className={`${styles.flexCenter}`}>
              <p className='text-sm font-normal leading-5 text-center text-[#9C9C9C]'>Whether you&apos;re renting or booking we&apos;re here to help you <br className='hidden sm:block'/>move forward.</p>
            </div>
          </div>
          {/* ===================== SECTION BODY =============== */}
          <div className='stayverz-section-body space-y-10'>
            <div className={`stayverz-property-tab w-full ${styles.flexCenter}`}>
              <div className=' bg-gray-100 p-[4.5px] rounded-[45px] border-[0.75px] border-solid border-[#F8F9FF] flex justify-center items-center'>
                {propertyType.map((item, index) =>  (
                  <button 
                    onClick={handlePropertyOptionClick(item.key)}
                    key={item.label} 
                    className={`text-sm font-medium leading-5 text-[#616161] border-none outline-none flex-1 py-2 px-6 sm:px-8 rounded-[45px] whitespace-nowrap ${styles.flexCenter} ${activeProperty ===  item.key ? 'bg-[#ffffff] text-[#f66c0e] border-[0.75px] border-solid border-[#FFF7F5] drop-shadow-sm' : ''}`} 
                  >
                    {item.label}
                  </button>
                ))}
          
              </div>
            </div>
            {activeProperty === 'host_property' && <HostProperty/>}
            {activeProperty === 'book_property' && <BookProperty/>}
          </div>
        </div>
      </div>
    </section>
  )
}

export default PropertyOption

export const HostProperty = () => {
  return (
    <div className='stayverz-property-options-wrapper grid md:grid-cols-3 gap-10 relative'>
      <Image src={PropertyCurveBg} alt='choose-property-curve-bg' width={1000} height={1000} className='hidden md:block absolute z-0 left-0 right-0 mx-auto w-[60%] bottom-[100px]'/>
      {[
        {
          imgUrl: HostRefer2,
          title: 'Refer and Earn',
          shortDescription: 'Refer friends & family to be Stayverz hosts! Earn when they list their and guests\' book'
        }, 
        {
          imgUrl: HostRock,
          title: 'Rock-Bottom Commissions',
          shortDescription: 'Experience exceptional services with the lower commissions for a limited time'
        }, 
        {
          imgUrl: HostDamage,
          title: 'Damage Protection',
          shortDescription: 'After only 6 months, verified hosts enjoy damage protection for added assurance'
        }, 
      ].map((item, index) => (
        <div key={`property-option-${index}` } className={`w-[240px] mx-auto relative`}>
          <div className={`${styles.flexCenter}`}>
            <Image src={item.imgUrl} alt={item.title} width={220} height={150} className='w-[220px] h-auto'/>
          </div>
          <div className={`space-y-[9px]`}>
            <h5 className='text-lg font-semibold leading-7 text-center text-[#202020] whitespace-nowrap'>{item.title}</h5>
            <p  className='text-sm font-normal leading-5 text-center text-[#9C9C9C]'>{item.shortDescription}</p>
          </div>
        </div>
      ))}
    </div>)
}


export const BookProperty = () => {
  return (
    <div className='stayverz-property-options-wrapper grid md:grid-cols-3 gap-10 relative'>
      <Image src={PropertyCurveBg} alt='choose-property-curve-bg' width={1000} height={1000} className='hidden md:block absolute z-0 left-0 right-0 mx-auto w-[60%] bottom-[100px]'/>
      {[
        {
          imgUrl: BookVisual,
          title: 'Visually Verified Properties',
          shortDescription: 'We verify each property and ensure you get exactly what you see when you are booking'
        }, 
        {
          imgUrl: BookSecured,
          title: 'Secured Payment System',
          shortDescription: 'We are here to safeguard your financial information throughout the booking process'
        }, 
        {
          imgUrl: BookSupport,
          title: 'Professional Support',
          shortDescription: 'Our customer service team is comprised of knowledgeable professionals ready to assist you with any questions or concerns'
        }, 
      ].map((item, index) => (
        <div key={`property-option-${index}` } className={`w-[240px] mx-auto relative`}>
          <div className={`${styles.flexCenter}`}>
            <Image src={item.imgUrl} alt={item.title} width={220} height={150} className='w-[220px] h-auto'/>
          </div>
          <div className={`space-y-[9px]`}>
            <h5 className='text-lg font-semibold leading-7 text-center text-[#202020] whitespace-nowrap'>{item.title}</h5>
            <p  className='text-sm font-normal leading-5 text-center text-[#9C9C9C]'>{item.shortDescription}</p>
          </div>
        </div>
      ))}
    </div>)
}
