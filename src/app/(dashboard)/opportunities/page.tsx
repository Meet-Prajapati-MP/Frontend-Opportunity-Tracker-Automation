import type { Metadata } from "next";
import OpportunitiesDashboard from "./opportunities-dashboard";

export const metadata: Metadata = { title: "Opportunities" };

export default function OpportunitiesPage() {
  return <OpportunitiesDashboard />;
}
