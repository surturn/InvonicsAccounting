import client from './client';

export const parseMpesaPDF = (file: File, password?: string): Promise<{ transactions: any[] }> => {
  const formData = new FormData();
  formData.append('pdf', file);
  if (password) {
    formData.append('password', password);
  }
  return client.post('/tools/parse-mpesa-statement', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then((r: any) => r.data);
};
