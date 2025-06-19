'use client'

import { ReactNode, useState } from 'react'
import { InitializerProvider } from '~/contexts/InitializerContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const Providers = ({children}: {children: ReactNode}) => {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <InitializerProvider>
        {children}
      </InitializerProvider>
    </QueryClientProvider>
  )
}
