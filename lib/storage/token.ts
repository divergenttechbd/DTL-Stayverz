import Cookie from 'js-cookie'
import { STORAGE_KEY_ACCESS_TOKEN, STORAGE_KEY_REFRESH_TOKEN, STORAGE_KEY_USER_TYPE } from '~/constants/localstorage'

export const getToken = () => {
  return Cookie.get(STORAGE_KEY_ACCESS_TOKEN)
}

export const saveToken = (data: {access_token: string; refresh_token: string; user_type?: 'host' | 'guest', cookie_token?: string;} ) => {
  const expiry = 90
  // const expiry = 90
  const cookieOptions = {
      expires: expiry,
      path: '/', // <-- THIS IS THE FIX. Makes the cookie available to all paths.
      // In production, you'll also want:
      // secure: true,
      // sameSite: 'lax'
  }

  // Set your main access token (without 'bearer')
  Cookie.set(STORAGE_KEY_ACCESS_TOKEN, data.access_token, cookieOptions)

  // Set the specific "cookie_token" that your backend seems to be looking for
  if (data.cookie_token) {
    Cookie.set('cookie_token', data.cookie_token, cookieOptions)
  }

  // Also set the other cookies with the correct path
  Cookie.set(STORAGE_KEY_REFRESH_TOKEN, data.refresh_token, cookieOptions)
  if (data.user_type) {
    Cookie.set(STORAGE_KEY_USER_TYPE, data.user_type, cookieOptions)
  }
}
