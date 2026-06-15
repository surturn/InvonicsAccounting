import client from './client';
import { PLReport, TOTReport, TrialBalanceRow, CashFlowReport, TrialBalanceReport } from '../types';

export const getPLReport = (from: string, to: string): Promise<PLReport> =>
  client.get('/reports/pl', { params: { from, to } }).then((r: any) => r.data);

export const getTOTReport = (from: string, to: string): Promise<TOTReport> =>
  client.get('/reports/tot', { params: { from, to } }).then((r: any) => r.data);

export const getTrialBalance = (from: string, to: string): Promise<TrialBalanceReport | TrialBalanceRow[]> =>
  client.get('/reports/trial-balance', { params: { from, to } }).then((r: any) => r.data);

export const getCashFlow = (from: string, to: string): Promise<CashFlowReport> =>
  client.get('/reports/cashflow', { params: { from, to } }).then((r: any) => r.data);
