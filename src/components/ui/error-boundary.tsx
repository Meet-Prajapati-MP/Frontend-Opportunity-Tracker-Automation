"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "./button";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
          <div className="rounded-full bg-destructive/10 p-5">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Unexpected Error</h2>
            <p className="max-w-sm text-sm text-muted-foreground">
              {this.state.error?.message ?? "An unexpected error occurred."}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => this.setState({ hasError: false, error: undefined })}
          >
            Try Again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
