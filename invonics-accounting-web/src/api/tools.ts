import client from './client';

export const parseMpesaPDF = (file: File): Promise<{ transactions: any[] }> => {
  const formData = new FormData();
  formData.append('document', file);
  return client.post('/tools/mpesa-parser', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then((r: any) => r.data);
};
