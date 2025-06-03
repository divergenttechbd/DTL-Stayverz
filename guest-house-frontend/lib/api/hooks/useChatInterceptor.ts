import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { refreshToken } from '~/queries/client/auth'
import { axiosChatApiInstance } from '~/lib/api/apiClient'
import { saveToken } from '~/lib/storage/token'
import { useAuthActionsLogout } from '~/store/authStore'

interface UseChatInterceptorArgs {
  onRefreshToken?: () => void
}

export const useChatInterceptor = (args?: UseChatInterceptorArgs) => {
  const { onRefreshToken } = args || {}
  const router = useRouter()
  const logout = useAuthActionsLogout()
  const { push } = router
  const { refetch: refetchRefreshTokenQuery } = useQuery({ queryKey: ['refreshChatToken'], queryFn: refreshToken, enabled: false, staleTime: 5000 })

  useEffect(() => {
    axiosChatApiInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalConfig = error.config
        if (error.response?.status === 403) {
          try {
            const { data: resp } = await refetchRefreshTokenQuery()
            if (resp?.isSucceed) {
              saveToken({access_token: resp.data.access_token, refresh_token: resp.data.refresh_token})
              originalConfig.headers['Authorization'] = `Bearer ${resp.data.access_token}`
              onRefreshToken?.()
              return axiosChatApiInstance(originalConfig)
            }
            throw resp?.error
          } catch (error) {
            logout()
            return Promise.reject(error)
          }
        }
        return Promise.reject(error)
      }
    )
  }, [push, refetchRefreshTokenQuery, onRefreshToken, logout])
  return null
}
