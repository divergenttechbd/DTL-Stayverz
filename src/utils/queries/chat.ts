import axiosInstance from '../axios';

export const updateRestriction: any = async (data: any) => {
  const endpoint = `${process.env.REACT_APP_API_CHAT}/chat/admin/rooms/${data.id}/`;
  return axiosInstance.patch(endpoint, data);
};
