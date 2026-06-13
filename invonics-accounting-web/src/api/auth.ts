import client from './client';
import { User } from '../types';

export const loginUser = (body: { email: string; password: string }) =>
  client.post('/auth/login', body).then((r: any) => r.data);

export const registerUser = (body: { name: string; email: string; password: string }) =>
  client.post('/auth/register', body).then((r: any) => r.data);

export const logoutUser = () =>
  client.post('/auth/logout').then((r: any) => r.data);

export const getMe = (): Promise<User> =>
  client.get('/auth/me').then((r: any) => r.data);
