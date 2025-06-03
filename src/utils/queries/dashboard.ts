import axios from '../axios';

export const getDashboardStat: any = async (data: any) => {
  const endpoint = '/accounts/admin/dashboard-stat/';
  return axios.get<any>(endpoint, { params: data });
};

export const getStatistics: any = async (data: any) => {
  const endpoint = '/bookings/admin/statistics/';
  return axios.get<any>(endpoint, { params: data });
};

export const getBestSellingHosts: any = async (data: any) => {
  const endpoint = '/accounts/admin/top-hosts/?query_type=MONTHLY';
  return axios.get<any>(endpoint, { params: data });
};
