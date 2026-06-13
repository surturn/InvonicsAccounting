import client from './client';
import { Account } from '../types';

export const getAccounts = (): Promise<Account[]> =>
  client.get('/accounts').then((r: any) => r.data);
