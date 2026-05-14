import { useQuery } from "@tanstack/react-query";
import { trackingService } from "@/services/api";
import { QUERY_KEYS } from "@/lib/constants";

export function useTracking() {
  return useQuery({
    queryKey: QUERY_KEYS.tracking,
    queryFn: trackingService.getAll,
    staleTime: 1000 * 60 * 2, // 2 min
  });
}
