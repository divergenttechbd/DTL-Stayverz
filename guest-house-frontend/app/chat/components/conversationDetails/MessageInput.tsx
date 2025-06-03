import { ArrowCircleUp } from '@phosphor-icons/react'
import { ChangeEventHandler, FC, MouseEventHandler, useCallback, useEffect, useState } from 'react'
import { useInput } from '~/app/chat/hooks/useInput'
import { useConversationDetailsActions } from '~/app/chat/store/conversationDetailsStore'

interface MessageInputProps {
  className?: string
  onSubmit: (value: string) => void
  onType?: (value: string) => void
}

export const MessageInput: FC<MessageInputProps> = ({
  className='',
  onSubmit,
  onType,
}) => {
  const { register, value, hasValue, onChange, handleSubmit, ref } = useInput<HTMLTextAreaElement>({onSubmit})
  const [inputFocused, setInputFocused] = useState(false)
  const { setMessgageInputFocused } = useConversationDetailsActions()

  const handleArrowClick: MouseEventHandler = useCallback((e) => {
    e.preventDefault()
    handleSubmit()
    ref.current?.focus()
  }, [handleSubmit, ref])

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback((e) => {
    onChange(e)
    onType?.(e.target.value)
  }, [onChange, onType])

  const handleFocusChange = useCallback((status: boolean) => () => {
    setInputFocused(status)
    setMessgageInputFocused(status)
  }, [setMessgageInputFocused])

  useEffect(() => {
    return () => setMessgageInputFocused(false)
  }, [setMessgageInputFocused])

  return (
    <div className={`flex basis-full items-center gap-2 px-2 border text-[#202020] rounded-[2rem] ${inputFocused ? 'border-2 border-gray-600' : 'border-gray-400'}`}>
      <textarea
        {...register()}
        value={value}
        onChange={handleChange}
        className={`max-sm:py-2 sm:py-3 px-2 resize-none focus-visible:outline-0 rounded-[2rem] flex moz-none-inner-focus ${className}`}
        placeholder='Type a message'
        onFocus={handleFocusChange(true)}
        onBlur={handleFocusChange(false)}
        rows={1}
      />
      {hasValue ? <ArrowCircleUp size={32} weight='fill' onClick={handleArrowClick} className='cursor-pointer' /> : null}
    </div>
  )
}
