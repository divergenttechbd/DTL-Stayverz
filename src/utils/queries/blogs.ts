import axios from '../axios';

export const getBlog: any = async (id: number) => {
  const endpoint = `/blogs/admin/blogs/${id}/`;
  return axios.get<any>(endpoint);
};

export const updateBlog: any = async (data: any) => {
  const endpoint = `/blogs/admin/blogs/${data.id}/`;
  return axios.patch(endpoint, data);
};

export const createBlog: any = async (data: any) => {
  const endpoint = `/blogs/admin/blogs/`;
  return axios.post(endpoint, data);
};

export const getBlogs: any = async (data: any) => {
  const endpoint = `/blogs/admin/blogs/`;
  return axios.get<any>(endpoint, { params: data });
};
