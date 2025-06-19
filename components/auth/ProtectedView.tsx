import { ReactNode } from 'react'
import { cookies } from 'next/headers'
import { STORAGE_KEY_ACCESS_TOKEN } from '~/constants/localstorage'

type ProtectedViewProps = {
  children: ReactNode
}

export const ProtectedView: React.FC<ProtectedViewProps> = ({children}) => {
  const cookieStore = cookies()
  const isAuthenticated = !!cookieStore.get(STORAGE_KEY_ACCESS_TOKEN)
  return isAuthenticated ? children : null
}
