import { CSSProperties } from 'react'

const useFadeStyles = () => {
  return {
    unmounted: {display: 'none'},
    entering: { opacity: 0, position: 'absolute' },
    entered:  { opacity: 1, },
    exiting:  { opacity: 1, display: 'none', position: 'absolute' },
    exited:  { opacity: 0, display: 'none', },
  } as Record<string, CSSProperties | undefined>
}

export default useFadeStyles

