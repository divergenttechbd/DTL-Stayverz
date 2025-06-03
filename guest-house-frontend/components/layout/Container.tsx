
import React, { ReactNode, FC } from 'react'

type ContainerProps = {
  children: ReactNode
}

const Container: FC<ContainerProps> = ({ children }) => {
  return (
    <div className={'sm:pt-navbar'}>
      {children}
    </div>
  )
}

export default Container
