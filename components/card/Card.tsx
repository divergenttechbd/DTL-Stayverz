import { UserCircle, X } from '@phosphor-icons/react'
import Link from 'next/link'
import React, { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  footerButtonText: string
  className?: string
  close?: Function
}

const Card: React.FC<CardProps> = ({ children, footerButtonText,className, close}) => {

  /**
   * todo - Need to verify the API contacts if this card need to be shown of not. Then, this handleCloseCard will be on the parent component. 
  */
  const closeCard = () => {
    console.log('Card Closed')
    close?.()
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg w-full md:w-1/3 p-4 border border-gray-300 mt-10 sm:mt-20 ${className || ''}`}>
      {/* Card Header */}
      <div className='flex justify-between items-center'>
        <UserCircle size={24} />
        <button onClick={closeCard} className='p-1 rounded-2xl hover:bg-gray-100'>
          <X size={18} />
        </button>
      </div>

      {/* Card Body */}
      <div className='mt-4'>
        {children}
      </div>

      {/* Card Footer */}
      <div className='mt-4'>
        <Link href='/profile' className='inline-block bg-transparent text-gray-600 hover:text-gray-800 border border-gray-600 hover:border-gray-800 rounded px-4 py-2'>
          {footerButtonText}
        </Link>
      </div>
    </div>
  )
}

export default Card
