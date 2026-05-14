import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface SpinnerProps {
  className?: string;
  size?: number;
}

export function Spinner({ className, size = 20 }: SpinnerProps) {
  return (
    <Loader2
      className={cn("animate-spin text-muted-foreground", className)}
      size={size}
    />
  );
}

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "Loading...",
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground",
        className
      )}
    >
      <Spinner size={32} />
      <p className="text-sm">{message}</p>
    </div>
  );
}
