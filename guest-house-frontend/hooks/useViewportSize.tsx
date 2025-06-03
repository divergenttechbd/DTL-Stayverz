import { useState, useMemo, useLayoutEffect, useRef, useCallback } from 'react'
import throttle from 'lodash/throttle'

type ViewportSizeType = {
  width?: number
  height?: number
}

interface UseViewportSizeArgs {
  watchOnce?: boolean
  throttle?: number
}

const useViewportSize = (args?: UseViewportSizeArgs) => {
  const { watchOnce, throttle:delay=1000 } = args || {}
  const [viewportSize, setViewportSize] = useState<ViewportSizeType>({
    width: undefined,
    height: undefined,
  })
  const watched = useRef(false)
  const throttledHandleResize = useMemo(() => throttle(() => {
    setViewportSize({width: window.visualViewport?.width, height: window.visualViewport?.height})
  }, delay), [delay])

  const handleResize = useCallback(() => throttledHandleResize(), [throttledHandleResize])

  useLayoutEffect(() => {
    handleResize()
    watched.current = true
  }, [handleResize])

  useLayoutEffect(() => {
    if (watchOnce && watched.current) return
    window.visualViewport?.addEventListener('resize', handleResize)
    watched.current = true
    return () => {
      if (watchOnce) window.visualViewport?.removeEventListener('resize', handleResize)
    }
  }, [watchOnce, handleResize])

  return {
    viewportSize
  }
}

export default useViewportSize

