'use client'

import { useSearchParams } from 'next/navigation'
import ResponsiveNavbar from '~/components/layout/ResponsiveNavbar'
import useWindowSize from '~/hooks/useWindowSize'

type MessageNavbarProps = {
  showDesktopNavInMobileView?: boolean
}

export const MessageNavbar = ({showDesktopNavInMobileView = true}: MessageNavbarProps) => {
  const searchParams = useSearchParams()
  const { isMobileView } = useWindowSize()
  return (isMobileView && searchParams.get('conversation_id')) ? null : (
    <ResponsiveNavbar showDesktopNavInMobileView={showDesktopNavInMobileView}/>
  )
}




