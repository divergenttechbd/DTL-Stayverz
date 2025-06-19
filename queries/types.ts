import { AxiosRequestConfig } from 'axios'
import { apiClient, chatApiClient } from '~/lib/api/apiClient'

export type Query<T=any> = (configs?: AxiosRequestConfig) => ReturnType<typeof apiClient<T>>
export type ChatQuery<T=any, K=any> = (configs?: AxiosRequestConfig) => ReturnType<typeof chatApiClient<T, K>>
