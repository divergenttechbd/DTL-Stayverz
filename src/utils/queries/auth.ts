import axios from '../axios'
import { ForgotPasswordDataType } from './types'

export const resetPasswordOtp = async (data:ForgotPasswordDataType) => {
    const endpoint = '/accounts/public/admin-reset-password/';
    return axios.post(endpoint, data)
}


export const resetPassword = async (data:ForgotPasswordDataType) => {
    const endpoint = '/accounts/public/admin-reset-password/';
    return axios.post(endpoint, data)
}