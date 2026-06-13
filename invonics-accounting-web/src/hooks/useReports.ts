import { useQuery } from '@tanstack/react-query';
import { getPLReport, getTOTReport, getTrialBalance, getCashFlow } from '../api/reports';

export function usePLReport(from: string, to: string) {
  return useQuery({
    queryKey: ['reports', 'pl', from, to],
    queryFn: () => getPLReport(from, to),
    staleTime: 5 * 60 * 1000,
    enabled: !!from && !!to,
  });
}

export function useTOTReport(from: string, to: string) {
  return useQuery({
    queryKey: ['reports', 'tot', from, to],
    queryFn: () => getTOTReport(from, to),
    staleTime: 5 * 60 * 1000,
    enabled: !!from && !!to,
  });
}

export function useTrialBalance(from: string, to: string) {
  return useQuery({
    queryKey: ['reports', 'tb', from, to],
    queryFn: () => getTrialBalance(from, to),
    staleTime: 5 * 60 * 1000,
    enabled: !!from && !!to,
  });
}

export function useCashFlow(from: string, to: string) {
  return useQuery({
    queryKey: ['reports', 'cf', from, to],
    queryFn: () => getCashFlow(from, to),
    staleTime: 5 * 60 * 1000,
    enabled: !!from && !!to,
  });
}
