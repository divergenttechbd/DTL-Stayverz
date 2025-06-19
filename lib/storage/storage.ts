export const getData = (key: string): any | null => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(key)
    try {
      return JSON.parse(data!)
    } catch (error) {
      return data
    }
  }
  return null
}

export const setData = (key: string, data: any): void => {
  const strData = typeof data === 'string' ? data : JSON.stringify(data)
  localStorage.setItem(key, strData)
}

export const removeData = (key: string): void => {
  localStorage.removeItem(key)
}
