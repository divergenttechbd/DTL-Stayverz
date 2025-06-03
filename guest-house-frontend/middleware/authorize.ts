import { NextRequest, NextResponse } from 'next/server'
import { STORAGE_KEY_ACCESS_TOKEN, STORAGE_KEY_USER_TYPE } from '~/constants/localstorage'

const HOST_ROUTES = [
  '/host-dashboard',
  '/room-list',
  '/profile',
  '/create-listing',
  '/user',
  '/all-notification',
  '/terms-and-conditions',
  '/refund-policy',
  '/privacy-policy',
  '/blog',
  '/contact',
  '/aboutus'
]

const GUEST_ROUTES = [
  '/temp',
  '/room-list',
  '/account-settings',
  '/profile',
  '/trips',
  '/checkout',
  '/rooms',
  '/user',
  '/messages',
  '/wishlists',
  '/contact',
  '/about',
  '/blog',
  '/all-notification',
  '/terms-and-conditions',
  '/refund-policy',
  '/privacy-policy'
]

export function authorizeUserTypeRoutes(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userType = request.cookies.get(STORAGE_KEY_USER_TYPE)
  const isAuthenticated = !!request.cookies.get(STORAGE_KEY_ACCESS_TOKEN)

  if (isAuthenticated) {
    if (userType?.value === 'host' && !HOST_ROUTES.find(i => pathname.startsWith(i))) {
      return NextResponse.redirect(new URL('/host-dashboard', request.url))
    } else if (userType?.value === 'guest' && pathname !== '/' && !GUEST_ROUTES.find(i => pathname.startsWith(i))) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  return NextResponse.next()
}
