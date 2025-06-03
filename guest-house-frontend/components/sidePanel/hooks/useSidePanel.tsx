import { useCallback, useState } from 'react'

export const useSidePanel = () => {
  const [show, setShow] = useState(false)

  const handleShow = useCallback(() => setShow(true), [])
  const handleClose = useCallback(() => setShow(false), [])
  const handleToggle = useCallback(() => setShow(!show), [show])

  return {
    show,
    handleShow,
    handleClose,
    handleToggle,
  }
}

