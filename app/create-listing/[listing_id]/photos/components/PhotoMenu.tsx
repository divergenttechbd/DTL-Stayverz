import { FC, useCallback, useRef, useState } from 'react'
import { useDetectOutsideClick } from '~/hooks/useDetectOutsideClick'

type PhotoMenuProps = {
  onSet: () => void,
  isCover: boolean,
  onDelete: () => void,
}

export const PhotoMenu:FC<PhotoMenuProps> = ({
  onSet, onDelete, isCover
}) => {
  const [processing, setProcessing] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleClick = useCallback(async () => {
    if (processing) return
    setProcessing(true)
    setIsOpen(false)
    await onSet()
    setProcessing(false)
  }, [processing, onSet])

  const handleDelete = useCallback(async () => {
    onDelete()
    setIsOpen(false)
  }, [onDelete])

  const inputBox = useRef<HTMLDivElement>(null)


  useDetectOutsideClick(inputBox, () => setIsOpen(false), true)


  return (
    <div className='relative w-full flex justify-between' ref={inputBox}>
      {isCover && <div className='absolute left-1 top-1 m-1'>
        <div className='bg-white text-black text-sm font-medium mr-2 px-2.5 py-0.5 rounded '>Cover Image</div>
      </div>}
      <button
        onClick={toggleDropdown}
        className='inline-flex absolute right-2 items-center p-2 text-sm font-medium text-center text-[#202020] bg-white rounded-lg hover:bg-gray-100' type='button'> 
        <svg className='w-5 h-5' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 16 3'>
          <path d='M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z'/>
        </svg>
      </button>
      {isOpen && (
        <div className='absolute top-7 z-10 -right-24 text-[14px] mt-2 w-40 py-2 bg-white border border-gray-300 rounded shadow-lg'>
          <button type='button' disabled={isCover} onClick={handleClick} className='block w-full text-left px-4 py-2 hover:bg-blue-100 cursor-pointer disabled:text-gray-400'>
            Set as Cover Image
          </button>
          <button type='button' onClick={handleDelete} className='block px-4 text-left py-2 w-full hover:bg-blue-100 cursor-pointer'>
            Delete Image
          </button>
        </div>
      )}
    </div>
  )
}
