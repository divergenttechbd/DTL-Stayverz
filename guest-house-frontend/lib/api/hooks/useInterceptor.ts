import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { refreshToken } from '~/queries/client/auth'
import { axiosApiInstance } from '~/lib/api/apiClient'
import { saveToken } from '~/lib/storage/token'
import { useAuthActionsLogout } from '~/store/authStore'

export const useInterceptor = () => {
  const router = useRouter()
  const logout = useAuthActionsLogout()
  const { push } = router
  const { refetch: refetchRefreshTokenQuery } = useQuery({ queryKey: ['refreshToken'], queryFn: refreshToken, enabled: false, staleTime: 5000 })

  useEffect(() => {
    axiosApiInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalConfig = error.config
        if (error.response?.status === 401) {
          try {
            const { data: resp } = await refetchRefreshTokenQuery()
            if (resp?.isSucceed) {
              saveToken({access_token: resp.data.access_token, refresh_token: resp.data.refresh_token})
              originalConfig.headers['Authorization'] = `Bearer ${resp.data.access_token}`
              return axiosApiInstance(originalConfig)
            }
            throw resp?.error
          } catch (error) {
            logout()
            return Promise.reject(error) 
          }
        }
        if (error.response?.status === 403) push('/')
        return Promise.reject(error)
      }
    )
  }, [push, refetchRefreshTokenQuery, logout])
  return null
}
