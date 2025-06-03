'use client'
import { useEffect } from 'react'
import LocationWiseSearchDesktop from '~/app/home/components/search/locationWiseSearchAlt/LocationWiseSearchDesktop'
import LocationWiseSearchMobileAlt from '~/app/home/components/search/locationWiseSearchAlt/LocationWiseSearchMobileAlt'
import useLocationWiseSearchInitialValues from '~/app/home/hooks/useLocationWiseSearchInitialValues'
import useWindowSize from '~/hooks/useWindowSize'
import { styles } from '~/styles/classes'

const SearchDropdownContainer = () => {

  const { isMobileView } = useWindowSize()
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
    <div className={`w-full ${styles.flexCenter}`}>
      {!isMobileView ?  <LocationWiseSearchDesktop/> : <LocationWiseSearchMobileAlt/> }
    </div>)
}
export default SearchDropdownContainer
