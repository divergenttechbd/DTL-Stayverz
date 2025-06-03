export const getAsQueryString = (data: Record<string, any>) => {
  const searchParams = new URLSearchParams(data)
  return `?${searchParams}`
}

export const getObjectFromSearchParams = (searchParams: URLSearchParams) => {
  const object: { [key: string]: string } = {}
  for (const [key, value] of searchParams.entries()) {
    object[key] = value
  }

  return object
}
