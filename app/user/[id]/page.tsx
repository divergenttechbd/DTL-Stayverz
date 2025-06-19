import { ProfileDashboard } from '~/app/user/components/ProfileDashboard'

export default function UserProfile({params}: {params:{id: string}}) {
  return (
    <div className='h-full w-full pb-[40px] sm:px-20 sm:py-16'>
      <ProfileDashboard params={params}/>
    </div>
  )
}
