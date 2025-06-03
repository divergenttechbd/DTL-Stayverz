import { Star } from '@phosphor-icons/react'
import { FC } from 'react'

interface IRatingStar {
  rating: number
}
const RatingStar:FC<IRatingStar> = ({ rating }) => {
  const fullStars = Math.floor(rating)
  const emptyStars = 5 - fullStars
  return(
    <div className='flex'>
      {Array.from({ length: fullStars }).map((_, index) => (
        <Star key={index} size={14} weight='fill' />
      ))}
      {Array.from({ length: emptyStars }).map((_, index) => (
        <Star key={index} size={14} /> 
      ))}
    </div>
  )
}

export default RatingStar
