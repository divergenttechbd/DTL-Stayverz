import React from 'react'

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const WeekHeader = () => {
  return (
    <div className='flex'>
      {days.map((day) => (
        <div key={day} className='flex grow py-4 sm:py-6 justify-center color-white box-border bg-white border-b text-[12px] sm:text-[16px]'>
          {day}
        </div>
      ))}
    </div>
  )
}

export default WeekHeader
