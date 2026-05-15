"use client";

import { useMemo } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Plus,
  Target,
  Trash2,
  XCircle,
} from "lucide-react";
import {
  TRACKING_BOARD_STATUSES,
  useRemoveTrackingItem,
  useTracking,
  useUpdateTrackingStatus,
} from "@/hooks/useTracking";
import { OPPORTUNITY_STATUS, type OpportunityStatus } from "@/lib/constants";
import { formatDate, timeAgo, truncate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import type { TrackedOpportunity } from "@/types";

const STATUS_META: Record<OpportunityStatus, { label: string; columnClass: string }> = {
  new: { label: "New", columnClass: "border-emerald-500/30 bg-emerald-500/5" },
  saved: { label: "Saved", columnClass: "border-blue-500/40 bg-blue-500/5" },
  applied: { label: "Applied", columnClass: "border-violet-500/40 bg-violet-500/5" },
  accepted: { label: "Accepted", columnClass: "border-emerald-500/40 bg-emerald-500/5" },
  rejected: { label: "Rejected", columnClass: "border-red-500/40 bg-red-500/5" },
};

function nextStatus(status: OpportunityStatus): OpportunityStatus | null {
  if (status === OPPORTUNITY_STATUS.SAVED) return OPPORTUNITY_STATUS.APPLIED;
  if (status === OPPORTUNITY_STATUS.APPLIED) return OPPORTUNITY_STATUS.ACCEPTED;
  return null;
}

function BoardSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="h-8 w-40 rounded-md bg-muted animate-pulse" />
          <div className="h-4 w-80 max-w-full rounded-md bg-muted animate-pulse" />
        </div>
        <div className="h-8 w-28 rounded-md bg-muted animate-pulse" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="border-2">
            <CardHeader className="pb-2">
              <div className="h-5 w-32 rounded-md bg-muted animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 2 }).map((__, cardIndex) => (
                <div key={cardIndex} className="space-y-2 rounded-lg border border-border p-3">
                  <div className="h-4 w-full rounded-md bg-muted animate-pulse" />
                  <div className="h-3 w-2/3 rounded-md bg-muted animate-pulse" />
                  <div className="h-7 w-full rounded-md bg-muted animate-pulse" />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TrackingCard({
  item,
  onAdvance,
  onReject,
  onRemove,
  busy,
}: {
  item: TrackedOpportunity;
  onAdvance: (item: TrackedOpportunity) => void;
  onReject: (item: TrackedOpportunity) => void;
  onRemove: (item: TrackedOpportunity) => void;
  busy: boolean;
}) {
  const canAdvance = !!nextStatus(item.status);

  return (
    <div className="space-y-3 rounded-lg border border-border/70 bg-card p-3">
      <div className="space-y-1">
        <p className="line-clamp-2 text-sm font-semibold text-foreground">
          {item.opportunity.title}
        </p>
        <p className="text-xs text-muted-foreground">
          {item.opportunity.organization} - {item.opportunity.category}
        </p>
      </div>

      <p className="text-xs text-muted-foreground">
        {truncate(item.opportunity.description, 110)}
      </p>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {item.opportunity.deadline ? (
          <span>Deadline {formatDate(item.opportunity.deadline)}</span>
        ) : (
          <span>No deadline</span>
        )}
        <span>Added {timeAgo(item.created_at)}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {canAdvance && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAdvance(item)}
            disabled={busy}
          >
            <ArrowRight className="h-3.5 w-3.5" />
            Move Forward
          </Button>
        )}

        {item.status !== OPPORTUNITY_STATUS.REJECTED &&
          item.status !== OPPORTUNITY_STATUS.ACCEPTED && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReject(item)}
              disabled={busy}
            >
              <XCircle className="h-3.5 w-3.5" />
              Reject
            </Button>
          )}

        <Button
          size="sm"
          variant="ghost"
          onClick={() => onRemove(item)}
          disabled={busy}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remove
        </Button>
      </div>
    </div>
  );
}

export default function TrackingBoard() {
  const { data, isLoading, isError, error, refetch } = useTracking();
  const updateStatus = useUpdateTrackingStatus();
  const removeItem = useRemoveTrackingItem();

  const grouped = useMemo(() => {
    const initial = Object.fromEntries(
      TRACKING_BOARD_STATUSES.map((status) => [status, [] as TrackedOpportunity[]])
    ) as Record<OpportunityStatus, TrackedOpportunity[]>;

    for (const item of data ?? []) {
      if (!TRACKING_BOARD_STATUSES.includes(item.status)) continue;
      initial[item.status].push(item);
    }

    return initial;
  }, [data]);

  const totalCount = data?.length ?? 0;
  const busy = updateStatus.isPending || removeItem.isPending;

  if (isLoading) {
    return <BoardSkeleton />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Failed to load tracking board"
        message={error instanceof Error ? error.message : "Please try again."}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Tracking</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your application pipeline from saved to final outcomes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline">{totalCount} tracked</Badge>
          <Button size="sm" variant="outline" onClick={() => void refetch()} disabled={busy}>
            <Plus className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {totalCount === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
            <Target className="mb-3 h-12 w-12 opacity-30" />
            <h3 className="font-semibold text-foreground">No tracked opportunities yet</h3>
            <p className="mt-1 text-sm">
              Add opportunities from the opportunities page to start tracking.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {TRACKING_BOARD_STATUSES.map((status) => {
            const items = grouped[status] ?? [];
            const meta = STATUS_META[status];
            const Icon =
              status === OPPORTUNITY_STATUS.SAVED
                ? Clock3
                : status === OPPORTUNITY_STATUS.APPLIED
                  ? ArrowRight
                  : status === OPPORTUNITY_STATUS.ACCEPTED
                    ? CheckCircle2
                    : XCircle;

            return (
              <Card key={status} className={`border-2 ${meta.columnClass}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {meta.label}
                    </span>
                    <Badge variant="outline">{items.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {items.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border/70 px-3 py-6 text-center text-xs text-muted-foreground">
                      Empty
                    </div>
                  ) : (
                    items.map((item) => (
                      <TrackingCard
                        key={item.id}
                        item={item}
                        busy={busy}
                        onAdvance={(current) => {
                          const next = nextStatus(current.status);
                          if (!next) return;
                          updateStatus.mutate({ id: current.id, status: next });
                        }}
                        onReject={(current) => {
                          updateStatus.mutate({
                            id: current.id,
                            status: OPPORTUNITY_STATUS.REJECTED,
                          });
                        }}
                        onRemove={(current) => {
                          removeItem.mutate(current.id);
                        }}
                      />
                    ))
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
