import client from './client';
import { Party } from '../types';

export const getParties = (type?: string): Promise<Party[]> =>
  client.get('/parties', { params: { type } }).then((r: any) => r.data);

export const getPartyById = (id: number): Promise<Party> =>
  client.get(`/parties/${id}`).then((r: any) => r.data);

export const createParty = (body: Partial<Party>): Promise<Party> =>
  client.post('/parties', body).then((r: any) => r.data);

export const updateParty = (id: number, body: Partial<Party>): Promise<Party> =>
  client.put(`/parties/${id}`, body).then((r: any) => r.data);

export const searchParties = (q: string): Promise<Party[]> =>
  client.get('/parties/search', { params: { q } }).then((r: any) => r.data);
