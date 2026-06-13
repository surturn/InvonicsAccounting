import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPeriods, getPeriodById, closePeriod } from '../api/periods';
import { useToast } from '../components/ui/Toast';

export function usePeriods() {
  return useQuery({
    queryKey: ['periods'],
    queryFn: getPeriods,
    staleTime: 5 * 60 * 1000,
  });
}

export function usePeriod(id: number) {
  return useQuery({
    queryKey: ['periods', id],
    queryFn: () => getPeriodById(id),
    enabled: !!id,
  });
}

export function useClosePeriod() {
  const queryClient = useQueryClient();
  const { success } = useToast();

  return useMutation({
    mutationFn: closePeriod,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['periods'] });
      queryClient.invalidateQueries({ queryKey: ['periods', id] });
      success('Period closed successfully');
    },
  });
}
