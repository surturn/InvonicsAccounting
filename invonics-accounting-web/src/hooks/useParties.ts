import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getParties, getPartyById, createParty, updateParty, searchParties } from '../api/parties';
import { Party } from '../types';
import { useToast } from '../components/ui/Toast';

export function useParties(type?: string) {
  return useQuery({
    queryKey: ['parties', type],
    queryFn: () => getParties(type),
    staleTime: 5 * 60 * 1000,
  });
}

export function useParty(id: number) {
  return useQuery({
    queryKey: ['parties', id],
    queryFn: () => getPartyById(id),
    enabled: !!id,
  });
}

export function useCreateParty() {
  const queryClient = useQueryClient();
  const { success } = useToast();

  return useMutation({
    mutationFn: createParty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['parties'] });
      success('Party created successfully');
    },
  });
}

export function useUpdateParty() {
  const queryClient = useQueryClient();
  const { success } = useToast();

  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: Partial<Party> }) => updateParty(id, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['parties'] });
      queryClient.invalidateQueries({ queryKey: ['parties', variables.id] });
      success('Party updated successfully');
    },
  });
}

export function useSearchParties(q: string) {
  return useQuery({
    queryKey: ['parties', 'search', q],
    queryFn: () => searchParties(q),
    enabled: q.length > 2,
  });
}
