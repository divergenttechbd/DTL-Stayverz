'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import OtpVerification from '~/app/auth/components/otpVerification/OtpVerification'
import ConfirmPasswordForm from '~/app/auth/components/resetPassword/ConfirmPasswordForm'
import ForgotPasswordForm from '~/app/auth/components/resetPassword/ForgotPasswordForm'
import ChangePasswordForm from '~/app/auth/components/signup/ChangePasswordForm'
import ConfirmationMessage from '~/app/auth/components/signup/ConfirmationMessage'
import SignInForm from '~/app/auth/components/signup/SignInForm'
import SignUpForm from '~/app/auth/components/signup/SignUpForm'
import Modal from '~/components/modal/Modal'
import { useModal } from '~/components/modal/hooks/useModal'
import { saveToken } from '~/lib/storage/token'
import { createUser, forgotPassword, generateOtp, resetPassword } from '~/queries/client/auth'
import { AuthStore, useAuthStore } from '~/store/authStore'


type ActionType = 'SIGN_UP' | 'LOG_IN' | 'RESET_PASS_OTP' | 'FORGET_PASSWORD_FORM' | 'CONFIRMATION' | 'CONFIRM_PASSWORD_FORM' | 'SIGN_UP_OTP' | undefined

type AuthModalProps = {

}
interface AuthModalData {
  userFullName: string
  phoneNumber: string
  userRole: string
  password?: string
  validTill?: string,
  otp?: string | number
}

export const AuthView = ({ }: AuthModalProps) => {
  const router = useRouter()
  const [isModalOpen, handleModalOpen, handleModalClose] = useModal()
  const { getUserData, setIsAuthenticated, resetAuthFlowState } = useAuthStore()
  const [authData, setAuthData] = useState<AuthModalData>({
    userFullName: '',
    phoneNumber: '',
    userRole: '',
    password: '',
    otp: ''
  })
  const [otpExpirationTime, setOtpExpirationTime] = useState<number | null>(null)
  const { authFlow, authFlowSuccessRedirect } = useAuthStore()
  const phoneNumber = authData?.phoneNumber
  const userRole = authData?.userRole
  const modalTitle = (authFlow === 'SIGN_UP' || authFlow === 'SIGN_UP_OTP' || authFlow === 'LOG_IN' || authFlow === 'CONFIRMATION' || authFlow === 'GUEST_LOG_IN' || authFlow === 'HOST_LOG_IN') ? 'Welcome to Stayverz' : 'Reset Password'

  const handleSetActiveDropdown = useCallback((status?: AuthStore['authFlow']) => {
    useAuthStore.setState({ authFlow: status })
  }, [])

  const handleFlowComplete = useCallback((preventDefaultRedirect?: boolean, authData?: AuthModalData) => {
    handleModalClose()
    resetAuthFlowState()
    if (authFlowSuccessRedirect) router.push(authFlowSuccessRedirect)
    else if (!preventDefaultRedirect) router.push(authData?.userRole === 'host' ? '/host-dashboard' : '/profile')
  }, [resetAuthFlowState, handleModalClose, authFlowSuccessRedirect, router])

  const handleSuccess = useCallback((state: ActionType, data?: AuthModalData, otpExpire?: string) => {
    if (!state) {
      handleFlowComplete(data?.userRole === 'guest', data)
      return
    }
    if (state === 'RESET_PASS_OTP') {
      if (data?.phoneNumber) {
        setAuthData({
          ...data,
          phoneNumber: data?.phoneNumber,
          userRole: data?.userRole
        })
      }

    } else {
      if (data?.userFullName) {
        setAuthData({
          userFullName: data?.userFullName,
          phoneNumber: data?.phoneNumber,
          password: data?.password,
          userRole: data?.userRole,
        })
      }
    }

    if (otpExpire) {
      setOtpExpirationTime(Number(otpExpire))
    }
    handleSetActiveDropdown(state)
  }, [handleSetActiveDropdown, handleFlowComplete])


  const handleSwitch = useCallback((state: ActionType) => {
    if (state) {
      handleSetActiveDropdown(state)
    }
  }, [handleSetActiveDropdown])

  const handleOtpVerify = useCallback(async (otp: number) => {
    if (authFlow === 'SIGN_UP_OTP') {
      const payload = {
        userFullName: authData?.userFullName,
        phoneNumber: authData?.phoneNumber,
        password: authData?.password,
        userRole: authData?.userRole,
        otp: otp
      }
      try {
        const res = await createUser(payload)
        if (!res?.isSucceed) throw res
        saveToken({access_token: res.data.access_token, refresh_token: res.data.refresh_token})
        setIsAuthenticated(true)
        getUserData()
        handleSetActiveDropdown('CONFIRMATION')
      }
      catch (error) {
        return error
      }

    } else {
      const payload = {
        phone_number: authData?.phoneNumber,
        u_type: authData?.userRole,
        otp: otp,
        otp_verify: true,
        scope: 'reset_password'
      }
      try {
        const res = await forgotPassword(payload)
        if (!res?.isSucceed) throw res
        setAuthData({ ...authData, otp: otp })
        handleSetActiveDropdown('CONFIRM_PASSWORD_FORM')
      }
      catch (error) {
        return error
      }

    }
  }, [authFlow, getUserData, setIsAuthenticated, authData, handleSetActiveDropdown])

  const handleConfirmPassword = useCallback(async (state: string | null, password?: string) => {
    const payload = {
      phoneNumber: authData?.phoneNumber,
      password: password,
      userRole: authData?.userRole,
      otp: authData?.otp
    }
    try {
      const res = await resetPassword(payload)
      if (!res?.isSucceed) throw res
      saveToken({access_token: res.data.access_token, refresh_token: res.data.refresh_token})
      handleFlowComplete()
      getUserData()
    }
    catch (error) {
      console.error(error)
      return error
    }
  }, [getUserData, handleFlowComplete, authData])

  const handleOtpGeneration = useCallback(async (formData: { userFullName?: string, recipient?: string, userRole?: string }) => {
    let payload = {}
    payload = {
      userFullName: authData?.userFullName ? authData.userFullName : formData?.userFullName,
      phone_number: authData?.phoneNumber ? authData?.phoneNumber : formData?.recipient,
      u_type: authData?.userRole ? authData.userRole : formData?.userRole,
      scope: authFlow === 'SIGN_UP_OTP' || authFlow === 'SIGN_UP' ? 'register' : 'reset_password'
    }
    try {
      const res: any = await generateOtp(payload)
      if (!res?.isSucceed) throw res
      return res
    }
    catch (error) {
      return error
    }

  }, [authFlow, authData])


  return (
    <div className=''>
      <Modal
        show={!!authFlow}
        onClose={() => {
          resetAuthFlowState()
          // handleModalClose()
        }}
        modalContainerclassName='slide-in-bottom w-full h-full sm:h-auto sm:rounded-xl sm:w-[538px] overflow-y-auto'
        title={modalTitle}
        titleContainerClassName='items-center justify-center gap-5 p-4 border-b'
        crossBtnClassName='absolute left-4 top-1/2 -translate-y-1/2'
        bodyContainerClassName='p-6'
      >
        {authFlow === 'SIGN_UP' && (
          <SignUpForm
            onSuccess={handleSuccess}
            onSubmit={handleOtpGeneration}
            handleSwitch={handleSwitch}
          />
        )}
        {authFlow === 'CHANGE_PASSWORD' && (
          <ChangePasswordForm
            onSuccess={handleSuccess}
            handleModalClose={resetAuthFlowState}
          />
        )}

        {(authFlow === 'SIGN_UP_OTP' || authFlow === 'RESET_PASS_OTP') && otpExpirationTime && (
          <OtpVerification
            otpExpirationTime={otpExpirationTime}
            onVerifyOtp={handleOtpVerify}
            phoneNumber={phoneNumber}
            onGenerateOtp={handleOtpGeneration}
          />
        )}
        {authFlow === 'CONFIRMATION' && <ConfirmationMessage userRole={userRole} />}
        {(authFlow === 'LOG_IN' || authFlow === 'GUEST_LOG_IN' || authFlow === 'HOST_LOG_IN') && (
          <SignInForm
            onSuccess={handleSuccess}
            handleSwitch={handleSwitch}
            authFlow={authFlow}
          />
        )}
        {authFlow === 'FORGET_PASSWORD_FORM' && (
          <ForgotPasswordForm onSuccess={handleSuccess} />
        )}
        {authFlow === 'CONFIRM_PASSWORD_FORM' && (
          <ConfirmPasswordForm onSubmit={handleConfirmPassword} onSuccess={handleFlowComplete} />
        )}
      </Modal>
    </div>
  )
}
