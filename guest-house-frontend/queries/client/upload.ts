import { apiClient } from '~/lib/api/apiClient'
import { convertPayloadToFormData } from '~/queries/utils/queryUtils'

export const uploadFile = async (data: {
  document: any,
  folder: string,
}) => {
  const endpoint = `document-upload/`
  return await apiClient({
    endpoint: endpoint,
    method: 'post',
    data: convertPayloadToFormData(data),
  })
}
