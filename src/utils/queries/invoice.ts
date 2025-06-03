import axios from '../axios'

export const getPayment: any = async (id: number) => {
  const endpoint = `/payments/admin/host-payments/${id}/`;
  return axios.get<any>(endpoint);
};

export const updatePayment: any = async (data: any) => {
  const endpoint = `/payments/admin/host-payments/${data.id}/`;
  return axios.patch(endpoint, data);
};

export const createPayment: any = async (data: any) => {
  const endpoint = `/payments/admin/host-payments/`;
  return axios.post(endpoint, data);
};

export const getPayments: any = async (data: any) => {
  const endpoint = `/payments/admin/host-payments/`;
  return axios.get<any>(endpoint, { params: data });
};

export const getHostPaymentMethods: any = async (id: number) => {
  const endpoint = `/payments/admin/host-pay-methods/?host=${id}`
  return axios.get<any>(endpoint)
}
