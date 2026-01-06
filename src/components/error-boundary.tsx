"use client";

import { useEffect } from "react";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Error caught by boundary:", error);
  }, [error]);

  return (
    <div 
      className="flex min-h-[400px] flex-col items-center justify-center gap-4 p-8"
      role="alert"
      aria-live="assertive"
      aria-labelledby="error-heading"
    >
      <div 
        className="rounded-full bg-destructive/10 p-4"
        aria-hidden="true"
      >
        <svg
          className="h-8 w-8 text-destructive"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      
      <div className="text-center">
        <h2 
          id="error-heading"
          className="text-xl font-semibold text-foreground"
        >
          Something went wrong!
        </h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          An unexpected error occurred. Our team has been notified.
        </p>
        {error.digest && (
          <p className="mt-1 text-xs text-muted-foreground">
            <span className="sr-only">Error ID: </span>
            {error.digest}
          </p>
        )}
      </div>

      <button
        onClick={reset}
        className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Try loading the page again"
      >
        Try again
      </button>
    </div>
  );
}
