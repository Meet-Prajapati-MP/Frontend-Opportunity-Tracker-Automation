import Link from "next/link";
import { Home } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-center">
      <div className="space-y-2">
        <p className="text-7xl font-black text-primary">404</p>
        <h2 className="text-xl font-semibold text-foreground">Page not found</h2>
        <p className="text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
      <Link
        href="/dashboard"
        className={cn(buttonVariants({ variant: "default" }))}
      >
        <Home className="h-4 w-4" />
        Back to Dashboard
      </Link>
    </div>
  );
}
