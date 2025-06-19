export interface Response<T=any> {
  code: number
  isSucceed: boolean
  data?: T 
  error?: string
  message?: any
  meta?: any
  stats?: any
}


export interface ChatResponse<T=any, K=any> {
  code: number
  isSucceed: boolean
  data?: T
  extra_data?: K
  error?: string
  message?: any
  meta?: any
}
