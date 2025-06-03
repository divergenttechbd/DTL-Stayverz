import Image from 'next/image'
import { FC, ReactNode } from 'react'

interface ICardProps {
  bodyContainerClass?: string
  cardLink?: string
  cardImage?: string
  cardImageAlt?: string
  imageClass?: string
  children: ReactNode
}

const ListingCard:FC<ICardProps> = ({ bodyContainerClass, cardLink, cardImage, cardImageAlt, imageClass, children }) => {
  return (
    <>
      <div className={`bg-white border border-gray-200 rounded-xl ${bodyContainerClass}`}>
        <a href={cardLink}>
          <Image
            className={`rounded-t-lg w-full h-[200px] object-cover ${imageClass}`}
            src={cardImage || ''}
            alt={cardImageAlt || ''}
            height={100}
            width={100}
          />
          {children}
        </a>
      </div>
    </>
  )
}

export default ListingCard
