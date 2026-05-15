"use client";

import { useMemo } from "react";
import {
  Briefcase,
  Calendar,
  Clock,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useOpportunities } from "@/hooks/useOpportunities";
import { useTracking } from "@/hooks/useTracking";
import { OPPORTUNITY_STATUS } from "@/lib/constants";
import { formatDate, timeAgo, truncate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";

const RECENT_SIZE = 6;

function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <div className="h-8 w-40 rounded-md bg-muted animate-pulse" />
        <div className="h-4 w-80 max-w-full rounded-md bg-muted animate-pulse" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="space-y-2 pb-2">
              <div className="h-4 w-24 rounded-md bg-muted animate-pulse" />
              <div className="h-8 w-16 rounded-md bg-muted animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-3 w-40 rounded-md bg-muted animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="h-5 w-48 rounded-md bg-muted animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 4 }).map((__, rowIndex) => (
                <div key={rowIndex} className="h-14 rounded-lg bg-muted animate-pulse" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  helper,
  icon: Icon,
  iconClass,
}: {
  label: string;
  value: string;
  helper: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
}) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <div className="rounded-lg bg-secondary p-2">
          <Icon className={`h-4 w-4 ${iconClass}`} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-foreground">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardOverview() {
  const stats = useDashboardStats();
  const opportunities = useOpportunities({ page: 1, size: RECENT_SIZE });
  const tracking = useTracking();

  const hasAnyError = stats.isError || opportunities.isError || tracking.isError;

  const isInitialLoading = stats.isLoading || opportunities.isLoading || tracking.isLoading;

  const trackingCounts = useMemo(() => {
    const items = tracking.data ?? [];
    return {
      saved: items.filter((item) => item.status === OPPORTUNITY_STATUS.SAVED).length,
      applied: items.filter((item) => item.status === OPPORTUNITY_STATUS.APPLIED).length,
      accepted: items.filter((item) => item.status === OPPORTUNITY_STATUS.ACCEPTED).length,
      rejected: items.filter((item) => item.status === OPPORTUNITY_STATUS.REJECTED).length,
    };
  }, [tracking.data]);

  const upcomingDeadlines = useMemo(() => {
    const now = new Date();
    return (opportunities.data?.items ?? [])
      .filter((item) => item.deadline)
      .map((item) => ({ ...item, parsedDeadline: new Date(item.deadline as string) }))
      .filter((item) => item.parsedDeadline >= now)
      .sort((a, b) => a.parsedDeadline.getTime() - b.parsedDeadline.getTime())
      .slice(0, 5);
  }, [opportunities.data?.items]);

  if (isInitialLoading) {
    return <DashboardSkeleton />;
  }

  if (hasAnyError) {
    return (
      <ErrorState
        title="Failed to load dashboard"
        message="One or more dashboard sections failed to load. Please try again."
        onRetry={() => {
          void stats.refetch();
          void opportunities.refetch();
          void tracking.refetch();
        }}
      />
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your opportunity pipeline at a glance.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Opportunities"
          value={(stats.data?.total_opportunities ?? 0).toLocaleString()}
          helper="Across all ingested sources"
          icon={Briefcase}
          iconClass="text-primary"
        />
        <StatCard
          label="New Today"
          value={(stats.data?.new_today ?? 0).toString()}
          helper="Fresh opportunities discovered"
          icon={TrendingUp}
          iconClass="text-emerald-500"
        />
        <StatCard
          label="Tracked"
          value={(stats.data?.tracked ?? 0).toString()}
          helper="Currently in your pipeline"
          icon={Target}
          iconClass="text-blue-500"
        />
        <StatCard
          label="Deadlines This Week"
          value={(stats.data?.deadlines_this_week ?? 0).toString()}
          helper="Upcoming submissions to watch"
          icon={Clock}
          iconClass="text-amber-500"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Recent Opportunities</CardTitle>
            <CardDescription>Latest opportunities from your feed.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(opportunities.data?.items ?? []).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                <Sparkles className="mb-2 h-8 w-8 opacity-40" />
                <p className="text-sm">No opportunities available yet.</p>
              </div>
            ) : (
              (opportunities.data?.items ?? []).map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-border/70 p-3 transition-colors hover:bg-accent/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground line-clamp-1">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {item.organization} - {item.category}
                      </p>
                    </div>
                    <Badge variant="outline">{item.status}</Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {truncate(item.description, 110)}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">Posted {timeAgo(item.created_at)}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Pipeline Snapshot</CardTitle>
            <CardDescription>Tracking progress and nearest deadlines.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-blue-500/10 p-3">
                <p className="text-xs text-muted-foreground">Saved</p>
                <p className="mt-1 text-xl font-semibold text-foreground">{trackingCounts.saved}</p>
              </div>
              <div className="rounded-lg bg-violet-500/10 p-3">
                <p className="text-xs text-muted-foreground">Applied</p>
                <p className="mt-1 text-xl font-semibold text-foreground">{trackingCounts.applied}</p>
              </div>
              <div className="rounded-lg bg-emerald-500/10 p-3">
                <p className="text-xs text-muted-foreground">Accepted</p>
                <p className="mt-1 text-xl font-semibold text-foreground">{trackingCounts.accepted}</p>
              </div>
              <div className="rounded-lg bg-red-500/10 p-3">
                <p className="text-xs text-muted-foreground">Rejected</p>
                <p className="mt-1 text-xl font-semibold text-foreground">{trackingCounts.rejected}</p>
              </div>
            </div>

            <div className="space-y-2 border-t border-border/70 pt-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Upcoming Deadlines
              </p>
              {upcomingDeadlines.length === 0 ? (
                <p className="text-sm text-muted-foreground">No upcoming deadlines in recent items.</p>
              ) : (
                upcomingDeadlines.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-2 rounded-lg border border-border/60 px-3 py-2">
                    <div className="min-w-0">
                      <p className="line-clamp-1 text-sm font-medium text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.organization}</p>
                    </div>
                    <div className="inline-flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      {item.deadline ? formatDate(item.deadline) : "-"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
