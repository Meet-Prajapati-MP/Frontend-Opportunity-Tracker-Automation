"use client";

import { ErrorState } from "@/components/ui/error-state";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Page Error"
      message={error.message || "An unexpected error occurred."}
      onRetry={reset}
    />
  );
}
