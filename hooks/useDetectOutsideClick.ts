import { RefObject, useEffect } from 'react'

export const useDetectOutsideClick = (ref: RefObject<HTMLElement>, callback: () => void, enable?: boolean) => {
  useEffect(() => {
    if (!enable) return
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => {
      if (!enable) return
      document.removeEventListener('mousedown', handleClick)
    }
  }, [ref, callback, enable])
}
