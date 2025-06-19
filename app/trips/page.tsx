import MyTrips from '~/app/trips/components/MyTrips'


const HomePage = () => {
  return (
    <div className='relative pt-0 sm:pt-5 py-5 pb-15 sm:pb-5'>
      <div className='space-y-10'>
        <MyTrips />
        {/* =========== REVIEW SECTION =========== */}
      </div>
    </div>
  )
}

export default HomePage


