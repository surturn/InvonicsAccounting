import client from './client';
import { FiscalPeriod } from '../types';

export const getPeriods = (): Promise<FiscalPeriod[]> =>
  client.get('/periods').then((r: any) => r.data);

export const getPeriodById = (id: number): Promise<FiscalPeriod> =>
  client.get(`/periods/${id}`).then((r: any) => r.data);

export const closePeriod = (id: number): Promise<FiscalPeriod> =>
  client.post(`/periods/${id}/close`).then((r: any) => r.data);
