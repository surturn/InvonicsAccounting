import { User } from '../types';

export function useAuth(): { user: User | null; isLoading: boolean } {
  return { user: null, isLoading: false };
}
