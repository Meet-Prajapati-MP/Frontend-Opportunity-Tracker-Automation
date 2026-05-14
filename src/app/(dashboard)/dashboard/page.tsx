import type { Metadata } from "next";
import { Briefcase, Target, Sparkles, TrendingUp, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = { title: "Dashboard" };

const STAT_CARDS = [
  {
    label: "Total Opportunities",
    value: "—",
    icon: Briefcase,
    color: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  {
    label: "New Today",
    value: "—",
    icon: TrendingUp,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    label: "Tracked",
    value: "—",
    icon: Target,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    label: "Deadlines This Week",
    value: "—",
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your opportunity pipeline at a glance.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="transition-shadow hover:shadow-md"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <div className={`rounded-lg p-2 ${stat.bg}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-foreground">
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Placeholder sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Recent Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <Sparkles className="mb-2 h-8 w-8 opacity-40" />
              <p className="text-sm">Connect your backend to see data</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <Clock className="mb-2 h-8 w-8 opacity-40" />
              <p className="text-sm">No deadlines yet</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
