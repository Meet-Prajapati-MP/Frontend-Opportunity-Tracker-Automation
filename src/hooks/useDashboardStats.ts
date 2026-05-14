import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/api";
import { QUERY_KEYS } from "@/lib/constants";

export function useDashboardStats() {
  return useQuery({
    queryKey: QUERY_KEYS.stats,
    queryFn: dashboardService.getStats,
    staleTime: 1000 * 60 * 1, // 1 min
    refetchInterval: 1000 * 60 * 5, // auto-refresh every 5 min
  });
}
