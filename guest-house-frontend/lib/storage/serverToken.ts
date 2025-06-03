import { cookies } from 'next/headers'
import { STORAGE_KEY_ACCESS_TOKEN } from '~/constants/localstorage'

export const getServerSideToken = () => {
  const cookieStore = cookies()
  return cookieStore.get(STORAGE_KEY_ACCESS_TOKEN)?.value
}
