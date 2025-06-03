'use client'
import Link from 'next/link'

type ConfirmationMessageType = {
  userRole: string
}
const ConfirmationMessage = ({ userRole }: ConfirmationMessageType) => {
  const directionRoute = userRole === 'host' ? '/host-dashboard' : '/profile'

  const bodyText = userRole === 'host' ? 'You are just a click away to start hosting your amazing place and start exciting passive earning.' : 'You are just a click away to start booking amazing places and start your exciting vacation.'

  return (<div className='w-full flex justify-center'>
    <div className='w-[287px] mt-[25px]'>
      {/* <div className='flex justify-center mb-[20px]'>
        <Image src={Logo} width={82} height={74} alt='Stayverz Logo' />
      </div> */}

      <h3 className='mb-[17px] text-center text-[15px] font-[600] leading-[22px] text-[#333333]'>
        Welcome to Stayverz
      </h3>
      <p className='mb-[25px] text-center text-[10px] font-[700] leading-[22px] text-[#616161]'>
        {bodyText}
      </p>

      <div className='flex justify-center center-center'>
        <Link
          className='w-full bg-[#f66c0e] text-white text-[14px] font-[700] leading-[20px] py-[15px] px-[24px] rounded-[8px] text-center'
          href={directionRoute}
        >
          {userRole === 'host' ? 'Host Dashboard' : 'Congratulation'}
        </Link>
      </div>
    </div>
  </div>
  )
}
export default ConfirmationMessage
