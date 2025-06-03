import { VerifyProfile } from '~/app/profile/components/verifyProfile/VerifyProfile'

const HomePage: React.FC = () => {

  return (
    <div className='sm:h-content w-full px-5 sm:px-20 sm:py-16 overflow-y-auto scrollbar-hidden'>
      <VerifyProfile />
    </div>
  )
}

export default HomePage
