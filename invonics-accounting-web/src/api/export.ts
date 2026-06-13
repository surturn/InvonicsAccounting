import client from './client';

export const downloadTransactions = async (from: string, to: string, type?: string) => {
  const response = await client.get('/export/transactions', {
    params: { from, to, type },
    responseType: 'blob'
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Invonics_Transactions_${from}_${to}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const downloadPLSummary = async (from: string, to: string) => {
  const response = await client.get('/export/pl', {
    params: { from, to },
    responseType: 'blob'
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Invonics_PL_${from}_${to}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
