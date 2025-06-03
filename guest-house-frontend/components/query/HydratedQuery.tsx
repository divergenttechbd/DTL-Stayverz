import { ReactNode } from 'react'
import { dehydrate, Hydrate } from '@tanstack/react-query'
import { getQueryClient } from '~/lib/api/queryClient'
import { AxiosRequestConfig } from 'axios'

type HydratedQueryProps<T> = {
  children: ReactNode
  query: (data: AxiosRequestConfig) => Promise<T>
}

export const HydratedQuery = async <T, >({
  children,
  query
}: HydratedQueryProps<T>) => {
  const queryClient = getQueryClient()
  await queryClient.prefetchQuery(['posts'], query)
  const dehydratedState = dehydrate(queryClient)

  return (
    <Hydrate state={dehydratedState}>
      {children}
    </Hydrate>
  )
}
