import { apiClient } from '~/lib/api/apiClient'
import { Query } from '~/queries/types'

export const getEarnings:Query<IEarning[]> = async (data) => {
  const endpoint = `payments/host/pay-outs/`
  return await apiClient({
    method: 'GET',
    endpoint: endpoint,
    params: data?.params
  })
}

export const getEarningDetails:Query<IEarningDetailsItem[]> = async (data) => {
  const endpoint = `payments/host/pay-outs/${data?.params.id}/`
  return await apiClient({
    method: 'GET',
    endpoint: endpoint,
  })
}
