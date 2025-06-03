import { useState, useMemo, useLayoutEffect, useRef, useCallback } from 'react'
import throttle from 'lodash/throttle'

type WindowSizeType = {
  width?: number
  height?: number
}

export type BreakpointsType = 'sm' | 'md' | 'lg' | 'xl' | '2xl'

const BREAKPOINTS: Record<BreakpointsType, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

interface UseWindowSizeArgs {
  watchOnce?: boolean
  throttle?: number
}

const useWindowSize = (args?: UseWindowSizeArgs) => {
  const { watchOnce, throttle:delay=1000 } = args || {}
  const [windowSize, setWindowSize] = useState<WindowSizeType>({
    width: undefined,
    height: undefined,
  })
  const watched = useRef(false)
  const throttledHandleResize = useMemo(() => throttle(() => {
    setWindowSize({width: window.innerWidth, height: window.innerHeight})
  }, delay), [delay])

  const breakpoint = useMemo<BreakpointsType>(() => {
    const breakpoints = Object.keys(BREAKPOINTS).reverse() as BreakpointsType[]
    return breakpoints.find(i => (windowSize.width || 0) >= BREAKPOINTS[i]) || 'sm'
  }, [windowSize])

  const handleResize = useCallback(() => throttledHandleResize(), [throttledHandleResize])

  useLayoutEffect(() => {
    handleResize()
    watched.current = true
  }, [handleResize])

  useLayoutEffect(() => {
    if (watchOnce && watched.current) return
    window.addEventListener('resize', handleResize)
    return () => {
      if (watchOnce) window.removeEventListener('resize', handleResize)
    }
  }, [watchOnce, handleResize])

  return {
    windowSize,
    breakpoint,
    isMobileView: breakpoint === 'sm'
  }
}

export default useWindowSize

