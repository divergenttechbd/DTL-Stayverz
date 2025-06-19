import { apiClient } from '~/lib/api/apiClient'
import { Query } from '~/queries/types'

export const getBlogs: Query = async () => {
  const endpoint = `blogs/public/blogs/`
  try {
    const response = await apiClient({
      method: 'GET',
      endpoint: endpoint
    })
    return response
  } catch (error) {
    throw error
  }
}

export const getBlogDetails: Query = async (slug) => {
  const endpoint = `blogs/public/blogs/${slug}`
  try {
    const response = await apiClient({
      method: 'GET',
      endpoint: endpoint
    })
    return response
  } catch (error) {
    throw error
  }
}
