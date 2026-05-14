import type { Metadata } from "next";
import { Search, SlidersHorizontal, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Opportunities" };

export default function OpportunitiesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Opportunities</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse and filter all discovered opportunities.
          </p>
        </div>
        <Button size="sm">
          <Briefcase className="h-4 w-4" />
          Refresh Feed
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search opportunities..." className="pl-9" />
        </div>
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* Empty state */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Briefcase className="mb-3 h-12 w-12 opacity-30" />
          <h3 className="font-semibold text-foreground">No opportunities yet</h3>
          <p className="mt-1 text-sm">
            Run the pipeline or connect the backend to start ingesting data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
