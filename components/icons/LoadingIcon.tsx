import { FC } from 'react'
import { CircleNotch } from '@phosphor-icons/react'

type LoadingIconProps = {
  fill?: string
  size?: 'sm' | 'lg' | 'md'
}

export const LoadingIcon:FC<LoadingIconProps> = ({
  fill='',
  size='md',
}) => {
  return (
    <CircleNotch className={`z-10 ${size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-10 h-10' : 'w-8 h-8'} animate-spin ${fill || 'fill-white'}`} />
  )
}
