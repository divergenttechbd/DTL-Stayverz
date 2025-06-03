import axios from '../axios';

export function convertPayloadToFormData(data: any) {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (data[key] === undefined) return;
    if (Array.isArray(data[key]) && data[key][0] instanceof File) {
      data[key].forEach((item: any) => formData.append(key, item));
    } else {
      formData.append(key, typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key]);
    }
  });
  return formData;
}

export const uploadFile = async (data: { document: any; folder: string }) => {
  const endpoint = `document-upload/`;
  return axios.post(endpoint, convertPayloadToFormData(data));
};
