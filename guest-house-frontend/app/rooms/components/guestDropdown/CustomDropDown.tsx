'use client'
import React, { useEffect, useRef, useState } from 'react'
import { CaretDown, CaretUp } from '@phosphor-icons/react'
import { styles } from '~/styles/classes'

type DropdownChildrenFunction = ({
  show,
  handleShow,
  handleClose,
  toggle,
}: {
  show: boolean
  handleShow: () => void
  handleClose: () => void
  toggle: () => void
}) => React.ReactNode

type DropdownProps = {
  children: DropdownChildrenFunction
}


const DropdownContainer: React.FC<DropdownProps> = ({ children }) => {

  const [showDropDown, setshowDropDown] = useState<boolean>(false)

  const handleShow = () => setshowDropDown(true)
  const handleClose = () => setshowDropDown(false)
  const toggle = () => setshowDropDown(prev => !prev)

  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        handleClose()
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  })

  return (
    <div ref={menuRef}
      className='relative custom-dropdown w-full'
    >
      {children({ show: showDropDown, handleShow, handleClose, toggle })}
    </div>)
}



type DropDownHeadProps = {
  show: boolean
  toggle: () => void
  children: React.ReactNode
}

const DropDownHead: React.FC<DropDownHeadProps> = ({ show, toggle, children }) => {
  return (
    <button onClick={toggle} className='relative w-full cursor-pointer'>
      {children}
      <div className={`absolute right-2 top-0 bottom-0 my-auto ${styles.flexCenter}`}>
        {show ? <CaretUp size={20} color='#222222' /> : <CaretDown size={20} color='#222222' />}
      </div>
    </button>
  )
}

type DropDownBodyProps = {
  show: boolean
  children: React.ReactNode
}

const DropDownBody: React.FC<DropDownBodyProps> = ({ show, children }) => {
  return (
    <div id='custom-dropdown' className={`absolute z-10 top-[50px] left-0 right-0 mx-auto ${show ? 'block' : 'hidden'}`}>
      <div className='bg-[#ffffff] border rounded-sm px-4 py-5 shadow-md w-full h-full'>
        {children}
      </div>
    </div>
  )
}


export { DropdownContainer, DropDownHead, DropDownBody }
