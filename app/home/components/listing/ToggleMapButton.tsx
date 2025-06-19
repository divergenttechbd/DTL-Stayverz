'use client'
import React, { FC } from 'react'
import { ListBullets } from '@phosphor-icons/react/dist/ssr/ListBullets'
import { MapTrifold } from '@phosphor-icons/react/dist/ssr/MapTrifold'

type ToggleMapButtonProps = {
  showMap: boolean,
  toggleMap: () => void
}

const ToggleMapButton: FC<ToggleMapButtonProps> = ({ showMap, toggleMap }) => {
  return (
    <button onClick={toggleMap}
      className='z-10 px-5 py-3 flex  left-1/2 transform -translate-x-1/2 rounded-full bg-black fixed bottom-20 sm:bottom-10'>
      {showMap ?
        <div className='flex items-center  text-white text-sm gap-2'>
          Show List
          <ListBullets size={20} />
        </div> : <div className='flex items-center  text-white text-sm gap-2'>
          Show Map
          <MapTrifold size={20} />
        </div>}
    </button>
  )
}

export default ToggleMapButton
