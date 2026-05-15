import type { Metadata } from "next";
import AiSearchClient from "./ai-search-client";

export const metadata: Metadata = { title: "AI Search" };

export default function AiSearchPage() {
  return <AiSearchClient />;
}
