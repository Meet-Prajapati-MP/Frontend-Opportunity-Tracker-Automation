import { useMutation } from "@tanstack/react-query";
import { aiService } from "@/services/api";
import { QUERY_KEYS } from "@/lib/constants";

export function useAiSearch() {
  return useMutation({
    mutationKey: QUERY_KEYS.aiSearch,
    mutationFn: (query: string) => aiService.search(query),
  });
}
