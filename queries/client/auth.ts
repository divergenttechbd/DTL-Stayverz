import Cookie from 'js-cookie'
import { apiClient, tokenApiClient } from '~/lib/api/apiClient'
import { STORAGE_KEY_REFRESH_TOKEN } from '~/constants/localstorage'


export const createUser = async (data: any) => {
  const endpoint = 'accounts/public/register/'

  const payload = {
    full_name: data?.userFullName,
    phone_number: data?.phoneNumber,
    password: data?.password,
    u_type: data?.userRole,
    otp: data?.otp
  }

  return await apiClient({
    endpoint: endpoint,
    method: 'post',
    data: payload,
  })

}

export const forgotPassword = async (data: any) => {
  const endpoint = 'otp/public/otp-validate/'
  
  return await apiClient({
    endpoint: endpoint,
    method: 'post',
    data: data,
  })
}

export const resetPassword = async (data: any) => {
  const endpoint = 'accounts/public/reset-password/'

  const payload = {
    phone_number: data?.phoneNumber,
    otp: data?.otp,
    password: data?.password,
    u_type: data?.userRole
  }

  return await apiClient({
    endpoint: endpoint,
    method: 'post',
    data: payload,
  })

}

export const login = async (data: any) => {
  const endpoint = 'accounts/public/login/'

  const payload = {
    phone_number: data?.phoneNumber,
    password: data?.password,
    u_type: data?.userRole
  }

  return await apiClient({
    endpoint: endpoint,
    method: 'post',
    data: payload,
    withCredentials: true
  })

}

export const changePassword = async (data: any) => {
  const endpoint = 'accounts/user/password-change/'
  return await apiClient({
    endpoint: endpoint,
    method: 'post',
    data: data,
    withCredentials: true
  })

}


export const generateOtp = async (data: any) => {
  const endpoint = 'otp/public/otp-request/'
  return  await apiClient({
    endpoint: endpoint,
    method: 'post',
    data: data,
  })
 
}

export const getUserDetails = async () => {
  const endpoint = 'accounts/user/profile/'

  return await apiClient({
    endpoint: endpoint,
  })
}

export const refreshToken = async () => {
  const endpoint = 'accounts/public/refresh-token/'
  
  try {
    const response = await tokenApiClient({
      endpoint: endpoint,
      method: 'POST',
      data: {
        refresh_token: Cookie.get(STORAGE_KEY_REFRESH_TOKEN),
      },
      headers: {Authorization: undefined},
      withCredentials: true
    })
    return response
  } catch (error) {
    throw error
  }
}
