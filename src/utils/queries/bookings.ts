import axios from '../axios';

export const getBookings: any = async (data: any) => {
  const endpoint = '/bookings/admin/bookings/';
  return axios.get<any>(endpoint, { params: data });
};
export const getLatestBookings: any = async (data: any) => {
  const endpoint = '/bookings/admin/latest-bookings/';
  return axios.get<any>(endpoint, { params: data });
};

export const getBooking: any = async (id: number) => {
  const endpoint = `/bookings/admin/bookings/${id}/`;
  return axios.get<any>(endpoint);
};

export const getReviews: any = async (data: any) => {
  const endpoint = `/bookings/admin/reviews/`;
  return axios.get<any>(endpoint, { params: data });
};

export const downloadCSV = async (params: any) => {
  const endpoint = `/bookings/admin/download-reports/`;

  try {
    const response: any = await axios.post<any>(endpoint, params, { responseType: 'blob' });

    const objectURL = URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = objectURL;
    link.setAttribute('download', 'report.xlsx');
    link.click();
    link.remove();
  } catch (error) {
    console.error('Error downloading CSV:', error);
    throw error;
  }
};
