import type { Metadata } from "next";
import { Settings, Bell, Palette, Database, Key } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const metadata: Metadata = { title: "Settings" };

const SETTING_SECTIONS = [
  {
    icon: Bell,
    label: "Notifications",
    description: "Configure alert preferences for new opportunities and deadlines.",
  },
  {
    icon: Palette,
    label: "Appearance",
    description: "Customize the theme, density, and display preferences.",
  },
  {
    icon: Database,
    label: "Data Sources",
    description: "Manage scraper sources and ingestion schedules.",
  },
  {
    icon: Key,
    label: "API Keys",
    description: "Manage your AI provider keys and integration tokens.",
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account and application preferences.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {SETTING_SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <Card
              key={section.label}
              className="cursor-pointer transition-shadow hover:shadow-md"
            >
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-sm">{section.label}</CardTitle>
                  <CardDescription className="mt-0.5 text-xs">
                    {section.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground italic">
                  Coming soon
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
