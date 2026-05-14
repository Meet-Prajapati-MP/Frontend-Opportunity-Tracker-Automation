import type { OpportunityStatus } from "@/lib/constants";

// ─── Opportunity ──────────────────────────────────────────────────────────────
export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  description: string;
  category: string;
  tags: string[];
  deadline: string | null;
  url: string;
  source: string;
  status: OpportunityStatus;
  ai_score: number | null;
  ai_summary: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Tracking ─────────────────────────────────────────────────────────────────
export interface TrackedOpportunity {
  id: string;
  opportunity_id: string;
  opportunity: Opportunity;
  status: OpportunityStatus;
  notes: string | null;
  applied_at: string | null;
  created_at: string;
}

// ─── AI Search ────────────────────────────────────────────────────────────────
export interface AiSearchResult {
  opportunities: Opportunity[];
  query: string;
  total: number;
  ai_explanation: string | null;
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────
export interface DashboardStats {
  total_opportunities: number;
  new_today: number;
  tracked: number;
  applied: number;
  deadlines_this_week: number;
}

// ─── API Response Wrappers ────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface ApiError {
  detail: string;
  status_code?: number;
}
