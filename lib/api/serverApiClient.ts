import axios, { AxiosRequestConfig } from 'axios'
import { getServerSideToken } from '~/lib/storage/serverToken'

export const axiosServerApiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL
})

export const serverApiClient = async <T=any>(requestConfig: AxiosRequestConfig & {endpoint: string}) => {
  const { endpoint, ...configs } = requestConfig
  const token = getServerSideToken()

  try {
    const response = await axiosServerApiInstance.request({
      url: `/${requestConfig.endpoint}`,
      ...configs,
      headers: { ...token && { Authorization: `Bearer ${token}` }, ...configs.headers }
    })

    return {
      code: response.status,
      isSucceed: true,
      data: (response.data.data ? response.data.data : response.data) as T,
      error: response.statusText,
      message: response.data.message,
      meta: response.data?.meta_data,
    }
  } catch (e) {
    const error = e as any
    throw {
      code: error.response?.status || 503,
      isSucceed: false,
      data: undefined,
      error: error.response?.data?.message instanceof Array ? error?.response.data.message.toString() : error?.response.data.message,
    }
  }
}

