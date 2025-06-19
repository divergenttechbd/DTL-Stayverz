'use client'

import { ReactNode, createContext, useEffect } from 'react'
import { useInterceptor } from '~/lib/api/hooks/useInterceptor'
import { useAuthStore } from '~/store/authStore'

export const InitializerContext = createContext({})

export const InitializerProvider = ({children}: {children: ReactNode}) => {
  useInterceptor()
  const { getUserData } = useAuthStore()

  useEffect(() => {
    getUserData()
  }, [getUserData])

  return (
    <InitializerContext.Provider value={{}}>{children}</InitializerContext.Provider>
  )
}
