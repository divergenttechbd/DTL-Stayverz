import { apiClient } from '~/lib/api/apiClient'
import { Query } from '~/queries/types'

export const getProfileDetails: Query = async () => {
  const endpoint = 'accounts/user/profile/'
  try {
    const response = await apiClient({
      method: 'GET',
      endpoint: endpoint
    }) 
    return response
  } catch (error) {
    console.error('Error getting profile:', error)
    throw error
  }
}


export const getUserProfileDetails: Query = async (data) => {
  const endpoint = `accounts/public/profile/${data?.params.id}`
  try {
    const response = await apiClient({
      method: 'GET',
      endpoint: endpoint
    }) 
    return response
  } catch (error) {
    console.error('Error getting profile:', error)
    throw error
  }
}

export const updateProfile = async (data:any) => {
  const endpoint = 'accounts/user/profile/'
  try {
    const response = await apiClient({
      endpoint: endpoint,
      method: 'PATCH',
      data: data,
    })
    return response
  } catch (error) {
    console.error('Error updating profile:', error)
    throw error
  }
}

export const verifyProfile = async (data: any) => {
  const endpoint = 'accounts/user/identity-verification/'
  return await apiClient({
    endpoint: endpoint,
    method: 'POST',
    data: data,
  })
}

export const getVerification = async () => {
  const endpoint = 'Verification/Get'
  return await apiClient({
    endpoint: endpoint,
  })
}


export const verifyEmail = async (data: any) => {
  const endpoint = 'accounts/user/email-verification/'
  
  return await apiClient({
    endpoint: endpoint,
    method: 'post',
    data: data,
  })
}

export const generateOtp = async (data: any) => {
  const endpoint = 'otp/user/otp-request/'
  
  return await apiClient({
    endpoint: endpoint,
    method: 'post',
    data: data,
  })
}


export const userLogout = async () => {
  const endpoint = 'accounts/user/logout/'
  
  return await apiClient({
    endpoint: endpoint,
    method: 'delete',
    withCredentials: true,
  })
}
