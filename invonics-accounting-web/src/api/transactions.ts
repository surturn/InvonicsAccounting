import client from './client';
import { 
  JournalEntry, 
  PaginatedResponse, 
  TransactionFilters, 
  CreateIncomeBody, 
  CreateExpenseBody, 
  CreateDrawingBody 
} from '../types';

export const getTransactions = (params: TransactionFilters): Promise<PaginatedResponse<JournalEntry>> =>
  client.get('/transactions', { params }).then((r: any) => r.data);

export const getTransactionById = (id: number): Promise<JournalEntry> =>
  client.get(`/transactions/${id}`).then((r: any) => r.data);

export const createIncome = (body: CreateIncomeBody): Promise<JournalEntry> =>
  client.post('/transactions/income', body).then((r: any) => r.data);

export const createExpense = (body: CreateExpenseBody): Promise<JournalEntry> =>
  client.post('/transactions/expense', body).then((r: any) => r.data);

export const createDrawing = (body: CreateDrawingBody): Promise<JournalEntry> =>
  client.post('/transactions/drawing', body).then((r: any) => r.data);

export const voidTransaction = (id: number, reason: string): Promise<JournalEntry> =>
  client.post(`/transactions/${id}/void`, { reason }).then((r: any) => r.data);
