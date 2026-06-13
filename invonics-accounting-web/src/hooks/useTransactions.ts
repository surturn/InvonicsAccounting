import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getTransactions, 
  getTransactionById, 
  createIncome, 
  createExpense, 
  createDrawing, 
  voidTransaction 
} from '../api/transactions';
import { TransactionFilters } from '../types';
import { useToast } from '../components/ui/Toast';

export function useTransactions(filters: TransactionFilters) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => getTransactions(filters),
    staleTime: 2 * 60 * 1000,
  });
}

export function useTransaction(id: number) {
  return useQuery({
    queryKey: ['transactions', id],
    queryFn: () => getTransactionById(id),
    enabled: !!id,
  });
}

export function useCreateIncome() {
  const queryClient = useQueryClient();
  const { success } = useToast();

  return useMutation({
    mutationFn: createIncome,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      success('Income transaction created successfully');
    },
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  const { success } = useToast();

  return useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      success('Expense transaction created successfully');
    },
  });
}

export function useCreateDrawing() {
  const queryClient = useQueryClient();
  const { success } = useToast();

  return useMutation({
    mutationFn: createDrawing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      success('Drawing transaction created successfully');
    },
  });
}

export function useVoidTransaction() {
  const queryClient = useQueryClient();
  const { success } = useToast();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) => voidTransaction(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      success('Transaction voided successfully');
    },
  });
}
