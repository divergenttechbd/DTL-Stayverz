import { ChangeEvent, InputHTMLAttributes, KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useWindowSize from '~/hooks/useWindowSize'

interface UseInputArgs {
  onSubmit: (value: string) => void
}

export const useInput = <T extends HTMLInputElement | HTMLTextAreaElement>({
  onSubmit,
}: UseInputArgs) => {
  const { isMobileView } = useWindowSize()
  const ref = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const isSubmittedByKeyDownRef = useRef(false)
  const [value, setValue] = useState('')
  const hasValue = useMemo(() => !!value.trim(), [value])

  const handleChange = useCallback((e: ChangeEvent<T>) => {
    if (isSubmittedByKeyDownRef.current) {
      setValue('')
      isSubmittedByKeyDownRef.current = false
      return
    }
    setValue(e.target.value)
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent<T>) => {
    if (e.shiftKey || e.key !== 'Enter' || !sanitizeValue(value)) return
    onSubmit(value)
    isSubmittedByKeyDownRef.current = true
  }, [onSubmit, value])

  const handleSubmit = useCallback(() => {
    onSubmit(value)
    setValue('')
  }, [value, onSubmit])

  useEffect(() => {
    if (ref?.current instanceof HTMLTextAreaElement) {
      ref.current.style.height = '0px'
      ref.current.style.height = `${ref.current.scrollHeight || 0}px`
    }
  }, [value])

  const register: () => InputHTMLAttributes<T> = useCallback(() => ({
    ref,
    onKeyDown: isMobileView ? undefined :handleKeyDown,
  }), [handleKeyDown, isMobileView])

  return { register, value, hasValue, onChange: handleChange, handleSubmit, ref }
}


const sanitizeValue = (value: string) => value.replace(/\s/g, '')
