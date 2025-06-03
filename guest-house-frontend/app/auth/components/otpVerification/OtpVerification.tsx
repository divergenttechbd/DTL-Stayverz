'use client'

import { FC, useCallback, useEffect, useRef, useState } from 'react'
import OtpInputWithTimer from '~/app/auth/components/otpVerification/OtpInputWithTimer'

type OtpVerificationProps = {
  title?: string
  phoneNumber?: string
  email?: string
  onVerifyOtp: Function
  otpExpirationTime: number
  onGenerateOtp: Function
}

const OtpVerification: FC<OtpVerificationProps> = ({ onVerifyOtp, onGenerateOtp, title, otpExpirationTime, phoneNumber, email }) => {
  const [otp, setOtp] = useState<string>('')
  const timerRef = useRef<NodeJS.Timeout | null>()
  const [timeRemaining, setTimeRemaining] = useState<number>(otpExpirationTime)
  const [isRequestingOtp, setIsRequestingOtp] = useState<boolean>(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState<boolean>(false)
  const [nonFieldError, setNonFieldError] = useState<string | undefined>()

  useEffect(() => {
    setTimeRemaining(otpExpirationTime)
  }, [otpExpirationTime])

  const clearTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  const beginOtpTimer = useCallback(() => {
    clearTimer()
    timerRef.current = setInterval(() => {
      if (timeRemaining === 0) {
        clearTimer()
        return
      }
      setTimeRemaining((prevTime) => prevTime - 1)
    }, 1000)
  }, [timeRemaining, clearTimer])

  const resetTimer = useCallback((expirationTime: number) => {
    setTimeRemaining(expirationTime)
    beginOtpTimer()
  }, [beginOtpTimer])

  useEffect(() => {
    beginOtpTimer()
  }, [beginOtpTimer])

  useEffect(() => {
    return () => {
      clearTimer()
    }
  }, [clearTimer])

  const handleGenerateOtp = useCallback(async () => {
    setIsRequestingOtp(true)
    try {
      const res = await onGenerateOtp()
      if (!res?.isSucceed) throw res
      setOtp('')
      setNonFieldError('A new otp has been sent again.')
      const remainingTime = res?.data?.valid_till
      resetTimer(Number(remainingTime))
    } catch (error) {
      console.error(error)
      return error
    } finally {
      setIsRequestingOtp(false)
    }
  },
  [resetTimer, onGenerateOtp]
  )

  const handleVerifyOtp = useCallback(async () => {
    setIsVerifyingOtp(true)
    try {
      const res = await onVerifyOtp(otp)
      if (!res?.isSucceed) {
        throw res
      }
      return res
    } catch (error: any) {
      setNonFieldError(error?.error)
      setTimeRemaining(0)
    } finally {
      setIsVerifyingOtp(false)
    }
  }, [onVerifyOtp, otp])

  return (
    <div className='w-full mb-7'>
      <h3 className='mb-[15px] text-center text-[15px] font-[600] leading-[22px] text-[#333333]'>
        {title || 'Confirm your phone number'}
      </h3>
      <p className='text-center text-[10px] font-[700] leading-[22px] text-[#616161]'>
        Enter the 5-digit code Stayverz just sent to {phoneNumber ? phoneNumber : email}
      </p>
      <OtpInputWithTimer
        otp={otp}
        setOtp={setOtp}
        timeRemaining={timeRemaining}
      />
      {nonFieldError && (<div className='flex justify-center pb-2'><span className='text-[14px] text-red-500 text-center'>{nonFieldError}</span></div>)}
      <div className='flex justify-center mb-[30px]'>
        <button
          disabled={otp?.length < 5 || isRequestingOtp || isVerifyingOtp}
          className='bg-[#f66c0e] text-white text-[14px] font-[700] leading-[20px] py-[15px] px-[24px] rounded-[8px] disabled:bg-[#DDDDDD]'
          onClick={handleVerifyOtp}
        >
          Continue
        </button>
      </div>
      <div className='flex justify-center'>
        <span className='color-[#616161] pr-1'>Didn’t get a text?</span>
        <button
          onClick={handleGenerateOtp}
          className='text-[14px] font-[700] leading-[22px] underline underline-offset-4'
        >
          Send again
        </button>
      </div>
    </div>
  )
}

export default OtpVerification


