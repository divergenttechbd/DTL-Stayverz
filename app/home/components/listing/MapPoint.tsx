import { InfoWindowF, OverlayViewF } from '@react-google-maps/api'
import React, { useCallback, useState } from 'react'
import GuestHouseCard from '~/app/home/components/listing/GuestHouseCard'

const MapPoint = ({ house }: { house: any }) => {
  const [showCard, setShowCard] = useState(false)
  const handleShowCard = useCallback((val: boolean) => () => { setShowCard(val) }, [])
  return (
    <OverlayViewF key={house.id} position={{ lat: house.latitude, lng: house.longitude }} mapPaneName='overlayMouseTarget'>
      <div className={`rounded-xl p-2 text-center z-10 relative hover:scale-110 cursor-pointer drop-shadow-lg  ${showCard ? 'bg-black text-white' : 'bg-white'}`}
        onClick={handleShowCard(true)}>
        ৳ {house.price}
      </div>

      {showCard && <InfoWindowF position={{ lat: house.latitude, lng: house.longitude }} onCloseClick={handleShowCard(false)}>
        <div className='max-w-[300px]'>
          <GuestHouseCard
            key={house.unique_id}
            {...house}
          />
        </div>
      </InfoWindowF>}
    </OverlayViewF>
  )
}

export default MapPoint
