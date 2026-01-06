import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  description?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, description, id, ...props }, ref) => {
    const errorId = error ? `${id}-error` : undefined;
    const descriptionId = description ? `${id}-description` : undefined;
    const ariaDescribedBy = [errorId, descriptionId].filter(Boolean).join(" ") || undefined;

    return (
      <div className="space-y-1.5">
        {label && (
          <label 
            htmlFor={id} 
            className="block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        
        {description && (
          <p 
            id={descriptionId}
            className="text-sm text-muted-foreground"
          >
            {description}
          </p>
        )}
        
        <input
          type={type}
          id={id}
          ref={ref}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={ariaDescribedBy}
          className={cn(
            "flex h-10 w-full rounded-lg border bg-background px-3 py-2 text-sm shadow-sm transition-colors",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-offset-1",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-destructive focus:border-destructive focus:ring-destructive/30"
              : "border-input focus:border-primary focus:ring-primary/30",
            className
          )}
          {...props}
        />
        
        {error && (
          <p
            id={errorId}
            role="alert"
            aria-live="polite"
            className="text-sm text-destructive flex items-center gap-1.5"
          >
            <svg 
              aria-hidden="true"
              className="h-4 w-4 flex-shrink-0" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
