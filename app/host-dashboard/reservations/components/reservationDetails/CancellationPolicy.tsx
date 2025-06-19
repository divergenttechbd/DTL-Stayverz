import { FC } from 'react'
import { IListing } from '~/app/host-dashboard/reservations/types'

interface ICancellationPolicy {
  listing: IListing
}

const CancellationPolicy:FC<ICancellationPolicy> = ({ listing }) => {
  return (
    <div className='pt-6 px-6'>
      <h3 className='text-xl mb-2 font-semibold text-[#202020]'>Cancellation Policy</h3>
      <h4 className='text-lg font-medium text-[#202020]'>{listing.cancellation_policy.policy_name}</h4>
      <p>{listing.cancellation_policy.description}</p>
    </div>
  )
}

export default CancellationPolicy
