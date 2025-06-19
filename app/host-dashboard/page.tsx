'use client'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import ReservationTabs from '~/app/host-dashboard/components/ReservationTabs'
import Card from '~/components/card/Card'

export default function Home() {
  const router = useRouter()
  
  const createListing = useCallback(async () => {
    router.push(`/create-listing/become-a-host/overview`)
  }, [router])

  const [showCard, setShowCard] = useState(true)

  const handleCloseCard = useCallback(() => {
    setShowCard(false)
  },[])

  return (
    <div className='container pb-[90px] sm:pb-0'>
      <div className='flex min-h-screen py-5 sm:py-10 flex-col sm:justify-between w-full mx-auto'>
        <div className='relative'>
          <div className='flex flex-row justify-between items-center'>
            <h1 className='text-xl sm:text-3xl font-medium text-[#202020] mb-5 sm:mb-10'>Welcome Back</h1>
            <button onClick={createListing} className='py-2 sm:py-2.5 px-3 sm:px-5 mb-2 text-sm font-medium text-[#202020] hover:border-black hover:outline-2 rounded-full border border-gray-200'>+ Create Listing</button>
          </div>
          <div className='flex flex-row justify-between items-center mb-5 sm:mb-4'>
            <h1 className='text-lg sm:text-xl font-medium'>Your reservations</h1>
          </div>
          <ReservationTabs />
        </div>
        {showCard && <Card footerButtonText='Add Profile Details' className={'sm:!mt-10'} close={handleCloseCard}>
          <h2 className='text-lg font-semibold'>Complete your Profile</h2>
          <p className='mt-2 text-gray-600'>Personalizing your profile can improve your search ranking and help guests get to know you better.</p>
        </Card> }
        
      </div>
    </div>
  )
}
