import axios from '../axios';

export const getReferrals: any = async (data: any) => {
  const endpoint = '/referrals/admin/referral-reports/referrers/';
  return axios.get<any>(endpoint, { params: data });
};