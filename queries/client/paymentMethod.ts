import { IPaymentMethod } from '~/app/host-dashboard/payouts/types'
import { apiClient } from '~/lib/api/apiClient'
import { Query } from '~/queries/types'

export const createPaymentMethod:Query = async (data) => {
  const endpoint = 'payments/host/pay-methods/'
  return await apiClient({
    method: 'POST',
    endpoint: endpoint,
    data: data?.data
  })
}

export const updatePaymentMethod:Query = async (data) => {
  const endpoint = `payments/host/pay-methods/${data?.data.id}/`
  return await apiClient({
    method: 'PATCH',
    endpoint: endpoint,
    data: data?.data
  })
}

export const getPaymentMethods:Query<IPaymentMethod[]> = async (data) => {
  const endpoint = `payments/host/pay-methods/`
  return await apiClient({
    method: 'GET',
    endpoint: endpoint,
    params: data?.params
  })
}
