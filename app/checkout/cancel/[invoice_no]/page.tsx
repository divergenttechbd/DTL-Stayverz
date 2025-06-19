'use client'

import { House } from '@phosphor-icons/react'
const Fail = () => {
  return (
    <div className='h-[100vh] w-full text-center relative'>
      <div className='fixed inset-0 w-fit h-fit m-auto'>
        <h1 className='font-semibold text-2xl text-[#f66c0e] mb-5'>Failed</h1>
        <h2 className='font-semibold text-xl text-blue-800 mb-2'>Unfortunately payment was rejected</h2>
        <a className='text-white bg-[#f66c0e] rounded-lg self-end px-6 py-2 sm:py-3 text-base flex justify-center items-center gap-3 mt-2' href='/'>
          <House size={20} color='#fcfcfc' />
          <span>Go Back To Home</span>
        </a>
      </div>
    </div>
  )
}

export default Fail
