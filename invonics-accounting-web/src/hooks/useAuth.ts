import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { getMe, loginUser, logoutUser, registerUser } from '../api/auth';
import { useToast } from '../components/ui/Toast';
import { User } from '../types';

export function useAuth() {
  const { data: user, isLoading, isError } = useQuery<User>({
    queryKey: ['auth', 'me'],
    queryFn: getMe,
    retry: false,
  });

  return { user: user ?? null, isLoading, isError };
}

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { error: toastError } = useToast();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      navigate('/dashboard');
    },
    onError: (err: any) => {
      toastError(err?.response?.data?.error || 'Login failed. Please try again.');
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { error: toastError } = useToast();

  return useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      navigate('/dashboard');
    },
    onError: (err: any) => {
      toastError(err?.response?.data?.error || 'Registration failed. Please try again.');
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.clear();
      navigate('/login');
    },
  });
}
