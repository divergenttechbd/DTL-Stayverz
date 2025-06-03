import axios from '../axios';

export const getNotifications: any = async (data: any) => {
  const endpoint = '/notifications/admin/notifications/';
  return axios.get<any>(endpoint, { params: data });
};

export const setAllAsRead: any = async () => {
  const endpoint = '/notifications/admin/notifications/0/?all_read=true';
  return axios.patch<any>(endpoint, { params: {} });
};

export const setAsRead: any = async (id: string) => {
  const endpoint = `/notifications/admin/notifications/${id}/`;
  return axios.patch<any>(endpoint, { params: {} });
};
