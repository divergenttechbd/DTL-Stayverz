import Cookie from 'js-cookie'
import { STORAGE_KEY_ACCESS_TOKEN, STORAGE_KEY_REFRESH_TOKEN, STORAGE_KEY_USER_TYPE } from '~/constants/localstorage'

export const getToken = () => {
  return Cookie.get(STORAGE_KEY_ACCESS_TOKEN)
}

export const saveToken = (data: {access_token: string; refresh_token: string; user_type?: 'host' | 'guest'}) => {
  const expiry = 90
  Cookie.set(STORAGE_KEY_ACCESS_TOKEN, data.access_token, {expires: expiry})
  Cookie.set(STORAGE_KEY_REFRESH_TOKEN, data.refresh_token, {expires: expiry})
  if (data.user_type) Cookie.set(STORAGE_KEY_USER_TYPE, data.user_type, {expires: expiry})
}
