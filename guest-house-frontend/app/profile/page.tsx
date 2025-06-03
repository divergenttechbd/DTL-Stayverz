'use client'

import { ProfileDashboard } from '~/app/profile/components/profileDashboard/ProfileDashboard'

export default function Home() {
  return (
    <div className='h-full w-full pb-[40px] sm:px-20 sm:py-16'>
      <ProfileDashboard />
    </div>
  )
}
