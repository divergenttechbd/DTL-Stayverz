import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { STORAGE_KEY_ACCESS_TOKEN } from '~/constants/localstorage'
import { authorizeUserTypeRoutes } from '~/middleware/authorize'


export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

const PROTECTED_ROUTES = [
  '/account-settings',
  '/host-dashboard',
  '/profile',
  '/create-listing',
  '/trips',
  '/checkout/success',
  '/rooms/contact-host',
  '/messages',
  '/wishlists'
]

export function middleware(request: NextRequest,) {
  const { pathname } = request.nextUrl
  const isAuthenticated = !!request.cookies.get(STORAGE_KEY_ACCESS_TOKEN)
  const isProtectedRoute = !!PROTECTED_ROUTES.find(i => pathname.startsWith(i))
  if (isProtectedRoute && !isAuthenticated) return NextResponse.redirect(new URL('/', request.url))
  return authorizeUserTypeRoutes(request)
}
