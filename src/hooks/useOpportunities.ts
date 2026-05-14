import { useQuery } from "@tanstack/react-query";
import { opportunityService } from "@/services/api";
import { QUERY_KEYS } from "@/lib/constants";

export function useOpportunities(params?: {
  page?: number;
  size?: number;
  category?: string;
  status?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: [...QUERY_KEYS.opportunities, params],
    queryFn: () => opportunityService.getAll(params),
    staleTime: 1000 * 60 * 5, // 5 min
  });
}

export function useOpportunity(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.opportunity(id),
    queryFn: () => opportunityService.getById(id),
    enabled: !!id,
  });
}
