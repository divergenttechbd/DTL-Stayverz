import axios from '../axios';

export const getServiceCharges: any = async (data: any) => {
  const endpoint = '/configurations/admin/service-charges/';
  return axios.get<any>(endpoint, { params: data });
};

export const createServiceCharge: any = async (data: any) => {
  const endpoint = '/configurations/admin/service-charges/';
  return axios.post(endpoint, data);
};
