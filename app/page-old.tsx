'use client'
import { useEffect, useState } from 'react'
import ListingFilter from '~/app/home/components/filter/ListingFilter'
import MapListing from '~/app/home/components/listing/MapListing'
import RoomList from '~/app/home/components/listing/RoomList'
import ToggleMapButton from '~/app/home/components/listing/ToggleMapButton'
import useLocationWiseSearchInitialValues from '~/app/home/hooks/useLocationWiseSearchInitialValues'
import Container from '~/components/layout/Container'
import ResponsiveNavbar from '~/components/layout/ResponsiveNavbar'

export default function Home() {
  const [showMap, setShowMap] = useState<boolean>(false)
  const toggleMap = () => setShowMap(prev => !prev)
  const { initialValues, setAnywhereValuesToStore, setNearbyValuesToStore, resetDefaultValuesToStore } = useLocationWiseSearchInitialValues()

  useEffect(() => {
    if (initialValues.searchType === 'nearby') {
      setNearbyValuesToStore()
    } else if (initialValues.searchType === 'anywhere') {
      setAnywhereValuesToStore()
    } else {
      resetDefaultValuesToStore()
    }
  }, [initialValues, setNearbyValuesToStore, setAnywhereValuesToStore, resetDefaultValuesToStore])

  return (
    <main className='w-full'>
      <ResponsiveNavbar wrapInContainer={false} />
      <Container>
        <div className='relative'>
          <div className='w-full h-full py-5 space-y-5'>
            <ListingFilter />
            {showMap ? <MapListing /> : <RoomList />}
            <ToggleMapButton showMap={showMap} toggleMap={toggleMap} />
          </div>
        </div>
      </Container>
    </main>
  )
}
