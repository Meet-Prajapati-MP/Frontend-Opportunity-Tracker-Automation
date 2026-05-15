import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { trackingService } from "@/services/api";
import { OPPORTUNITY_STATUS, QUERY_KEYS, type OpportunityStatus } from "@/lib/constants";

export function useTracking() {
  return useQuery({
    queryKey: QUERY_KEYS.tracking,
    queryFn: trackingService.getAll,
    staleTime: 1000 * 60 * 2, // 2 min
  });
}

export function useUpdateTrackingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OpportunityStatus }) =>
      trackingService.updateStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tracking });
    },
  });
}

export function useRemoveTrackingItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => trackingService.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tracking });
    },
  });
}

export function useTrackOpportunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (opportunityId: string) => trackingService.track(opportunityId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tracking });
    },
  });
}

export const TRACKING_BOARD_STATUSES: OpportunityStatus[] = [
  OPPORTUNITY_STATUS.SAVED,
  OPPORTUNITY_STATUS.APPLIED,
  OPPORTUNITY_STATUS.ACCEPTED,
  OPPORTUNITY_STATUS.REJECTED,
];
