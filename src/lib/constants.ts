export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Opportunity Tracker";
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Opportunities", href: "/opportunities", icon: "Briefcase" },
  { label: "Tracking", href: "/tracking", icon: "Target" },
  { label: "AI Search", href: "/ai-search", icon: "Sparkles" },
  { label: "Settings", href: "/settings", icon: "Settings" },
] as const;

export const QUERY_KEYS = {
  opportunities: ["opportunities"] as const,
  opportunity: (id: string) => ["opportunities", id] as const,
  tracking: ["tracking"] as const,
  aiSearch: ["ai-search"] as const,
  stats: ["stats"] as const,
} as const;

export const OPPORTUNITY_STATUS = {
  NEW: "new",
  SAVED: "saved",
  APPLIED: "applied",
  REJECTED: "rejected",
  ACCEPTED: "accepted",
} as const;

export type OpportunityStatus =
  (typeof OPPORTUNITY_STATUS)[keyof typeof OPPORTUNITY_STATUS];
