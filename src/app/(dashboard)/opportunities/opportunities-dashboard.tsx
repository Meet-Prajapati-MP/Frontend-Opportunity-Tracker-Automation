"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Briefcase,
  Calendar,
  ExternalLink,
  Filter,
  RefreshCcw,
  Search,
  Sparkles,
} from "lucide-react";
import { useOpportunities } from "@/hooks/useOpportunities";
import { OPPORTUNITY_STATUS, type OpportunityStatus } from "@/lib/constants";
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

const STATUS_FILTERS: Array<{ label: string; value: "all" | OpportunityStatus }> = [
  { label: "All", value: "all" },
  { label: "New", value: OPPORTUNITY_STATUS.NEW },
  { label: "Saved", value: OPPORTUNITY_STATUS.SAVED },
  { label: "Applied", value: OPPORTUNITY_STATUS.APPLIED },
  { label: "Accepted", value: OPPORTUNITY_STATUS.ACCEPTED },
  { label: "Rejected", value: OPPORTUNITY_STATUS.REJECTED },
];

const PAGE_SIZE = 12;

function statusBadgeVariant(status: OpportunityStatus):
  | "new"
  | "saved"
  | "applied"
  | "accepted"
  | "rejected"
  | "default" {
  if (status === OPPORTUNITY_STATUS.NEW) return "new";
  if (status === OPPORTUNITY_STATUS.SAVED) return "saved";
  if (status === OPPORTUNITY_STATUS.APPLIED) return "applied";
  if (status === OPPORTUNITY_STATUS.ACCEPTED) return "accepted";
  if (status === OPPORTUNITY_STATUS.REJECTED) return "rejected";
  return "default";
}

function formatScore(score: number | null): string {
  if (score === null) return "N/A";
  return `${Math.round(score * 100)}%`;
}

function StatCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{helper}</p>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-56 rounded-md bg-muted animate-pulse" />
          <div className="h-4 w-80 max-w-full rounded-md bg-muted animate-pulse" />
        </div>
        <div className="h-8 w-28 rounded-md bg-muted animate-pulse" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="space-y-2 pb-2">
              <div className="h-4 w-28 rounded-md bg-muted animate-pulse" />
              <div className="h-8 w-16 rounded-md bg-muted animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-3 w-40 rounded-md bg-muted animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Card className="h-fit">
          <CardHeader className="space-y-3 pb-3">
            <div className="h-5 w-24 rounded-md bg-muted animate-pulse" />
            <div className="h-9 w-full rounded-md bg-muted animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-8 w-full rounded-md bg-muted animate-pulse"
              />
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index}>
                <CardHeader className="space-y-3 pb-3">
                  <div className="h-5 w-32 rounded-md bg-muted animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-5 w-full rounded-md bg-muted animate-pulse" />
                    <div className="h-4 w-2/3 rounded-md bg-muted animate-pulse" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-4 w-full rounded-md bg-muted animate-pulse" />
                  <div className="h-4 w-5/6 rounded-md bg-muted animate-pulse" />
                  <div className="h-8 w-full rounded-md bg-muted animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="h-14 rounded-xl border border-border/70 bg-card p-4">
            <div className="h-5 w-56 rounded-md bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  return (
    <Card className="h-full border-border/80 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{opportunity.category}</Badge>
          <Badge variant={statusBadgeVariant(opportunity.status)}>
            {opportunity.status}
          </Badge>
          {opportunity.ai_score !== null && (
            <Badge variant="default" className="gap-1">
              <Sparkles className="h-3 w-3" />
              {formatScore(opportunity.ai_score)} match
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
          {truncate(opportunity.description, 180)}
        </p>

        <div className="flex flex-wrap gap-2">
          {opportunity.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {opportunity.deadline ? formatDate(opportunity.deadline) : "No deadline"}
          </div>
          <span>Posted {timeAgo(opportunity.created_at)}</span>
        </div>

        <a
          href={opportunity.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-full"
        >
          <Button variant="outline" className="w-full">
            View Opportunity
            <ExternalLink className="h-4 w-4" />
          </Button>
        </a>
      </CardContent>
    </Card>
  );
}

export default function OpportunitiesDashboard() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | OpportunityStatus>("all");
  const [category, setCategory] = useState<string>("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  const params = useMemo(() => {
    return {
      page,
      size: PAGE_SIZE,
      search: search || undefined,
      status: status === "all" ? undefined : status,
      category: category === "all" ? undefined : category,
    };
  }, [page, search, status, category]);

  const { data, isLoading, isError, error, refetch, isFetching } = useOpportunities(params);

  const opportunities = data?.items ?? [];

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const item of opportunities) {
      if (item.category) set.add(item.category);
    }
    if (category !== "all") set.add(category);
    return ["all", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [opportunities, category]);

  const stats = useMemo(() => {
    const withDeadlines = opportunities.filter((item) => !!item.deadline).length;
    const scored = opportunities.filter((item) => item.ai_score !== null);
    const avgAiScore =
      scored.length > 0
        ? scored.reduce((sum, item) => sum + (item.ai_score ?? 0), 0) / scored.length
        : null;

    return {
      total: data?.total ?? 0,
      onPage: opportunities.length,
      withDeadlines,
      avgAiScore,
    };
  }, [data?.total, opportunities]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load opportunities"
        message={error instanceof Error ? error.message : "Please try again."}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Opportunities</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Discover, filter, and review opportunities from your connected sources.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => void refetch()}
          disabled={isFetching}
        >
          <RefreshCcw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh Feed
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Results"
          value={stats.total.toLocaleString()}
          helper="Matching the active filters"
        />
        <StatCard
          label="Visible On Page"
          value={stats.onPage.toString()}
          helper={`Page ${data?.page ?? 1} of ${Math.max(data?.pages ?? 1, 1)}`}
        />
        <StatCard
          label="With Deadlines"
          value={stats.withDeadlines.toString()}
          helper="Current page opportunities"
        />
        <StatCard
          label="Average AI Match"
          value={stats.avgAiScore === null ? "N/A" : formatScore(stats.avgAiScore)}
          helper="Computed from scored results"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-20 lg:h-fit">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Filter className="h-4 w-4 text-muted-foreground" />
                Filters
              </CardTitle>
              <CardDescription>Refine results by status and category.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Status
                </p>
                <div className="flex flex-wrap gap-2 lg:flex-col lg:items-stretch">
                  {STATUS_FILTERS.map((item) => (
                    <Button
                      key={item.value}
                      size="sm"
                      variant={status === item.value ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => {
                        setStatus(item.value);
                        setPage(1);
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Category
                </p>
                <div className="flex flex-wrap gap-2 lg:flex-col lg:items-stretch">
                  {categories.map((item) => (
                    <Button
                      key={item}
                      size="sm"
                      variant={category === item ? "secondary" : "outline"}
                      className="justify-start"
                      onClick={() => {
                        setCategory(item);
                        setPage(1);
                      }}
                    >
                      {item === "all" ? "All Categories" : item}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setStatus("all");
                  setCategory("all");
                  setSearchInput("");
                  setSearch("");
                  setPage(1);
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </aside>

        <section className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search title, organization, or description"
                  className="pl-9"
                />
              </div>
            </CardContent>
          </Card>

          {isFetching && (
            <p className="text-sm text-muted-foreground">Refreshing opportunities...</p>
          )}

          {opportunities.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                <Briefcase className="mb-3 h-12 w-12 opacity-30" />
                <h3 className="font-semibold text-foreground">No opportunities found</h3>
                <p className="mt-1 text-sm">
                  Try changing your filters or run a fresh backend ingestion.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {opportunities.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>
          )}

          <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {opportunities.length} of {stats.total.toLocaleString()} opportunities
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={(data?.page ?? 1) <= 1 || isFetching}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              >
                Previous
              </Button>
              <span className="min-w-20 text-center text-sm text-muted-foreground">
                Page {data?.page ?? 1} / {Math.max(data?.pages ?? 1, 1)}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={(data?.page ?? 1) >= (data?.pages ?? 1) || isFetching}
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, Math.max(data?.pages ?? 1, 1)))
                }
              >
                Next
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
