import type { Metadata } from "next";
import { Target, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Tracking" };

const STATUS_COLUMNS = [
  { label: "Saved", color: "border-blue-500/50 bg-blue-500/5" },
  { label: "Applied", color: "border-violet-500/50 bg-violet-500/5" },
  { label: "Accepted", color: "border-emerald-500/50 bg-emerald-500/5" },
  { label: "Rejected", color: "border-red-500/50 bg-red-500/5" },
];

export default function TrackingPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Tracking</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Monitor your application pipeline.
          </p>
        </div>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          Add to Tracker
        </Button>
      </div>

      {/* Kanban columns */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {STATUS_COLUMNS.map((col) => (
          <div
            key={col.label}
            className={`rounded-xl border-2 p-4 ${col.color}`}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                {col.label}
              </h3>
              <span className="rounded-full bg-border px-2 py-0.5 text-xs text-muted-foreground">
                0
              </span>
            </div>
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Target className="mb-2 h-6 w-6 opacity-30" />
              <p className="text-xs">Empty</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
