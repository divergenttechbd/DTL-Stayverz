'use client'

import { Alarm } from '@phosphor-icons/react'
import dayjs from 'dayjs'
import React, { FC } from 'react'
import OtpInput from 'react-otp-input'

type OtpInputWithTimerProps = {
  otp: string;
  setOtp: ((otp: string) => void)
  timeRemaining: number;
};

type FormattedTimerType = (timeRemaining: any) => string;
const getFormattedTimer: FormattedTimerType = (timeRemaining) => {
  const formattedTime = dayjs().startOf('day').second(timeRemaining).format('mm:ss')
  return formattedTime
}

const OtpInputWithTimer: FC<OtpInputWithTimerProps> = ({
  otp,
  setOtp,
  timeRemaining,
}) => {
  
  // const borderValue = (otp?.length === 5 && (otp !== otpResponseValue)) ? '2px solid #FF0000' : '2px solid #ADADAD'

  return (
    <>
      <div className='flex justify-center mt-[40px]'>
        <OtpInput
          inputType='tel'
          value={otp}
          onChange={setOtp}
          numInputs={5}
          renderSeparator={<span className='pr-[15px]'></span>}
          renderInput={(props) => <input {...props} />}
          containerStyle={{
            border:'2px solid #ADADAD',
            width: '163px',
            padding: '7px',
            borderRadius: '10px'
          }}
          inputStyle={{border: 'none', outline: 'none'}}
          placeholder='-----'
          shouldAutoFocus
        />
      </div>
      {/* {(otp?.length === 5 && (otp !== otpResponseValue) ) && (<div className='flex content-center pt-3'>
        <WarningCircle size={20} color='#D53858' className='mt-[4px] me-[8px]'/>
        <p className='pt-1 text-red-500 text-[10px] font-[500] leading-[18px] text-left'>Sorry, we are not able to verify the code. Please make sure you input the right mobile<br /> number and code.</p>
      </div>
      )} */}
      <div className='flex content-center	justify-center pt-[20px]'>
        <div className='flex pt-[5px] mb-[24px]'>
          <Alarm size={14} color='#D53858'/>
        </div>

        <span className='text-[10px] font-[600] leading-[22px] text-[#D53858] pl-[6px]'>
          Hurry up {getFormattedTimer(timeRemaining)}
        </span>
      </div>
    </>
  )
}
export default OtpInputWithTimer
