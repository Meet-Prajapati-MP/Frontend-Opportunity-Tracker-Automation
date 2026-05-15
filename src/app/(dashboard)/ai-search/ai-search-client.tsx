"use client";

import { useMemo, useState } from "react";
import {
  Bot,
  Calendar,
  ExternalLink,
  Search,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { useAiSearch } from "@/hooks/useAiSearch";
import { useTrackOpportunity } from "@/hooks/useTracking";
import { formatDate, timeAgo, truncate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import type { Opportunity } from "@/types";

const EXAMPLE_QUERIES = [
  "Fellowships for early-career researchers in AI",
  "Grants for climate tech startups",
  "Youth leadership programs in Africa",
];

const PAGE_SIZE = 9;

function ResultsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index}>
          <CardHeader className="space-y-2 pb-3">
            <div className="h-5 w-24 rounded-md bg-muted animate-pulse" />
            <div className="h-5 w-full rounded-md bg-muted animate-pulse" />
            <div className="h-4 w-2/3 rounded-md bg-muted animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="h-4 w-full rounded-md bg-muted animate-pulse" />
            <div className="h-4 w-5/6 rounded-md bg-muted animate-pulse" />
            <div className="h-8 w-full rounded-md bg-muted animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function AiResultCard({
  opportunity,
  onTrack,
  isTracking,
}: {
  opportunity: Opportunity;
  onTrack: (id: string) => void;
  isTracking: boolean;
}) {
  return (
    <Card className="h-full border-border/80 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{opportunity.category}</Badge>
          {opportunity.ai_score !== null && (
            <Badge variant="default" className="gap-1">
              <Sparkles className="h-3 w-3" />
              {Math.round(opportunity.ai_score * 100)}% match
            </Badge>
          )}
        </div>

        <div>
          <CardTitle className="line-clamp-2 text-base leading-tight">
            {opportunity.title}
          </CardTitle>
          <CardDescription className="mt-1">
            {opportunity.organization} - {opportunity.source}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {truncate(opportunity.ai_summary ?? opportunity.description, 170)}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {opportunity.deadline ? formatDate(opportunity.deadline) : "No deadline"}
          </div>
          <span>Posted {timeAgo(opportunity.created_at)}</span>
        </div>

        <div className="flex gap-2">
          <a href={opportunity.url} target="_blank" rel="noreferrer" className="flex-1">
            <Button variant="outline" className="w-full">
              Visit
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
          <Button
            className="flex-1"
            onClick={() => onTrack(opportunity.id)}
            disabled={isTracking}
          >
            {isTracking ? "Adding..." : "Track"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AiSearchClient() {
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const aiSearch = useAiSearch();
  const trackOpportunity = useTrackOpportunity();

  const handleSearch = (value: string) => {
    const normalized = value.trim();
    if (!normalized) return;
    setActiveQuery(normalized);
    setPage(1);
    aiSearch.mutate(normalized);
  };

  const allResults = aiSearch.data?.opportunities ?? [];
  const totalPages = Math.max(Math.ceil(allResults.length / PAGE_SIZE), 1);

  const visibleResults = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return allResults.slice(start, start + PAGE_SIZE);
  }, [allResults, page]);

  const hasResults = allResults.length > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground">AI Search</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe what you are looking for and let AI surface relevant opportunities.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <div className="rounded-lg bg-primary/10 p-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            Semantic Search
          </CardTitle>
          <CardDescription>
            Search by intent, not only keywords.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="e.g. research grants for women in STEM under 30"
                className="pl-9"
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleSearch(query);
                  }
                }}
              />
            </div>
            <Button onClick={() => handleSearch(query)} disabled={!query.trim() || aiSearch.isPending}>
              <Send className="h-4 w-4" />
              {aiSearch.isPending ? "Searching..." : "Search"}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {EXAMPLE_QUERIES.map((exampleQuery) => (
              <button
                key={exampleQuery}
                onClick={() => {
                  setQuery(exampleQuery);
                  handleSearch(exampleQuery);
                }}
                className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                {exampleQuery}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {aiSearch.isError && (
        <ErrorState
          title="AI search failed"
          message={aiSearch.error instanceof Error ? aiSearch.error.message : "Please try again."}
          onRetry={() => {
            if (activeQuery) aiSearch.mutate(activeQuery);
          }}
        />
      )}

      {aiSearch.isPending && <ResultsSkeleton />}

      {!aiSearch.isPending && !aiSearch.isError && !activeQuery && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <div className="mb-4 flex gap-3">
              <div className="rounded-full bg-primary/10 p-3">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <div className="rounded-full bg-muted p-3">
                <User className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
            <p className="font-medium text-foreground">Ask the AI anything</p>
            <p className="mt-1 text-sm">Results will appear here after your search.</p>
          </CardContent>
        </Card>
      )}

      {!aiSearch.isPending && !aiSearch.isError && activeQuery && (
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Query: <span className="font-medium text-foreground">{activeQuery}</span>
                </p>
                <Badge variant="outline">{allResults.length} results</Badge>
              </div>
              {aiSearch.data?.ai_explanation && (
                <p className="mt-3 rounded-lg bg-secondary p-3 text-sm text-secondary-foreground">
                  {aiSearch.data.ai_explanation}
                </p>
              )}
            </CardContent>
          </Card>

          {!hasResults ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
                <Search className="mb-3 h-8 w-8 opacity-40" />
                <p className="font-medium text-foreground">No matching opportunities</p>
                <p className="mt-1 text-sm">Try a broader query or different phrasing.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visibleResults.map((opportunity) => (
                  <AiResultCard
                    key={opportunity.id}
                    opportunity={opportunity}
                    isTracking={trackOpportunity.isPending}
                    onTrack={(id) => trackOpportunity.mutate(id)}
                  />
                ))}
              </div>

              <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {visibleResults.length} of {allResults.length} results
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </Button>
                  <span className="min-w-20 text-center text-sm text-muted-foreground">
                    Page {page} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
