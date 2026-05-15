"use client";

import { usePathname } from "next/navigation";
import { Bell, Moon, Sun, Search, PanelLeft } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/opportunities": "Opportunities",
  "/tracking": "Tracking",
  "/ai-search": "AI Search",
  "/settings": "Settings",
};

interface NavbarProps {
  onOpenMobile: () => void;
}

export function Navbar({ onOpenMobile }: NavbarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const title =
    Object.entries(PAGE_TITLES).find(([key]) =>
      pathname.startsWith(key)
    )?.[1] ?? "Opportunity Tracker";

  return (
    <header className="flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 sm:px-6 backdrop-blur-sm">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        aria-label="Open navigation"
        onClick={onOpenMobile}
      >
        <PanelLeft className="h-4 w-4" />
      </Button>

      {/* Page Title */}
      <h1 className="text-base font-semibold text-foreground">{title}</h1>

      {/* Global Search */}
      <div className="relative ml-4 hidden max-w-sm flex-1 md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search opportunities..."
          className="pl-9 text-sm"
          aria-label="Global search"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle theme"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </div>
    </header>
  );
}
