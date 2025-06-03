import { useRouter } from 'next/navigation'
import React, { useCallback } from 'react'
import Button from '~/components/layout/Button'

const EmptyState = () => {
  const router = useRouter()
  const handleSearchClick = useCallback(() => {
    router.push('/')
  }, [router])
  
  return (
    <div>
      <h3 className='text-xl font-semibold mb-3'>No trips booked...yet!</h3>
      <p className='font-medium mb-4'>Time to dust off your bags and start planning your next adventure</p>
      <Button label='Start searching' variant='outlined' className='py-3' onclick={handleSearchClick}/>
    </div>
  )
}

export default EmptyState
