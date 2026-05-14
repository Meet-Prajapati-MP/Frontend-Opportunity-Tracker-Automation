import apiClient from "@/lib/api-client";
import type {
  Opportunity,
  PaginatedResponse,
  AiSearchResult,
  DashboardStats,
  TrackedOpportunity,
} from "@/types";

// ─── Opportunities ────────────────────────────────────────────────────────────
export const opportunityService = {
  getAll: async (params?: {
    page?: number;
    size?: number;
    category?: string;
    status?: string;
    search?: string;
  }): Promise<PaginatedResponse<Opportunity>> => {
    const response = await apiClient.get("/opportunities", { params });
    return response.data;
  },

  getById: async (id: string): Promise<Opportunity> => {
    const response = await apiClient.get(`/opportunities/${id}`);
    return response.data;
  },

  search: async (query: string): Promise<Opportunity[]> => {
    const response = await apiClient.get("/opportunities/search", {
      params: { q: query },
    });
    return response.data;
  },
};

// ─── Tracking ─────────────────────────────────────────────────────────────────
export const trackingService = {
  getAll: async (): Promise<TrackedOpportunity[]> => {
    const response = await apiClient.get("/tracking");
    return response.data;
  },

  track: async (opportunityId: string): Promise<TrackedOpportunity> => {
    const response = await apiClient.post("/tracking", {
      opportunity_id: opportunityId,
    });
    return response.data;
  },

  updateStatus: async (
    id: string,
    status: string
  ): Promise<TrackedOpportunity> => {
    const response = await apiClient.patch(`/tracking/${id}`, { status });
    return response.data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/tracking/${id}`);
  },
};

// ─── AI Search ────────────────────────────────────────────────────────────────
export const aiService = {
  search: async (query: string): Promise<AiSearchResult> => {
    const response = await apiClient.post("/ai/search", { query });
    return response.data;
  },
};

// ─── Dashboard ────────────────────────────────────────────────────────────────
export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get("/dashboard/stats");
    return response.data;
  },
};
