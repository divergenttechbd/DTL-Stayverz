import { RefObject,useState ,useCallback, useEffect} from 'react'

const useToggleDescriptionWithLineCount = (text: string | null, customRef?: RefObject<HTMLDivElement> | null) => {
  const [lineCount, setLineCount] = useState(0)
  const [showFullDescription, setShowFullDescription] = useState(false)

  const toggleDesriptionView = useCallback(() => {
    setShowFullDescription(prev => !prev)
  },[])

  const getTotalLines = useCallback(() => {
    let lines = 0
    if (customRef?.current && text) {
      const el = customRef.current
      const divHeight = el.offsetHeight
      const lineHeight = parseInt(window.getComputedStyle(el).lineHeight || '0')
      lines = divHeight / lineHeight
    }
    setLineCount(lines)
  },[customRef, text])

  useEffect(() => {
    getTotalLines()
  },[getTotalLines])


  return {
    lineCount,
    showFullDescription,
    toggleDesriptionView
  }

}

export default useToggleDescriptionWithLineCount
