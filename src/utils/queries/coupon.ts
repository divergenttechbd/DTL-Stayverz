import axios from '../axios';

export const getCoupons: any = async (data: any) => {
  const endpoint = '/coupons/list/';
  return axios.get<any>(endpoint, { params: data });
};

export const getCoupon: any = async (id: number) => {
  const endpoint = `/coupons/retrive/${id}`;
  return axios.get<any>(endpoint);
};

export const updateCoupon: any = async (data: any) => {
  const endpoint = `/coupons/retrive/${data.id}/`;
  return axios.patch(endpoint, data);
};

export const getStaffUsers: any = async (data: any) => {
  const endpoint = '/accounts/admin/staffs/';
  return axios.get<any>(endpoint, { params: data });
};

export const getStaffUser: any = async (id: number) => {
  const endpoint = `/accounts/admin/staffs/${id}/`;
  return axios.get<any>(endpoint);
};

export const updateStaffUser: any = async (data: any) => {
  const endpoint = `/accounts/admin/staffs/${data.id}/`;
  return axios.patch(endpoint, data);
};

export const createStaffUser: any = async (data: any) => {
  const endpoint = `/accounts/admin/staffs/`;
  return axios.post(endpoint, data);
};

export const downloadUserCSV = async (params: any) => {
  const endpoint = `/accounts/admin/users/`;

  try {
    const response: any = await axios.get<any>(endpoint, { params, responseType: 'blob' });

    const objectURL = URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = objectURL;
    link.setAttribute('download', 'report.xlsx');
    link.click();
    link.remove();
  } catch(error) {
    console.error('Error downloading CSV:', error);
    throw error;
  }
};
