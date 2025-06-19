import { useState } from 'react'

export const useModal = (): [boolean, () => void, () => void] => {
  const [state, setState] = useState<boolean>(false)
  const handleModalOpen = () => setState(true)
  const handleModalClose = () => setState(false)

  return [state, handleModalOpen, handleModalClose]
}
