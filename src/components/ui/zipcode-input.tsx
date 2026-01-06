"use client";

import * as React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getZipCodeConfig, formatZipCode } from "@/lib/i18n/zipcode";
import type { LocaleCode } from "@/lib/i18n/currency";

export interface ZipCodeInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  id: string;
  label?: string;
  error?: string;
  description?: string;
  locale?: LocaleCode;
  value?: string;
  onChange?: (value: string) => void;
}

const ZipCodeInput = React.forwardRef<HTMLInputElement, ZipCodeInputProps>(
  (
    {
      className,
      id,
      label,
      error,
      description,
      locale,
      value = "",
      onChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const config = getZipCodeConfig(locale);
    const errorId = error ? `${id}-error` : undefined;
    const descriptionId = description ? `${id}-description` : undefined;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const formatted = formatZipCode(inputValue, locale);
      onChange?.(formatted);
    };

    // Use custom label from config if no label prop provided
    const displayLabel = label ?? config.label;

    return (
      <div className="space-y-1.5">
        {displayLabel && (
          <label
            htmlFor={id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {displayLabel}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={id}
            type="text"
            inputMode="text"
            autoComplete="postal-code"
            value={value}
            onChange={handleChange}
            placeholder={config.placeholder}
            maxLength={config.maxLength}
            disabled={disabled}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              [errorId, descriptionId].filter(Boolean).join(" ") || undefined
            }
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-colors",
              error && "border-red-500 pr-10 focus-visible:ring-red-500",
              className
            )}
            {...props}
          />

          {error && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <AlertCircle
                className="h-5 w-5 text-red-500"
                aria-hidden="true"
              />
            </div>
          )}
        </div>

        {description && !error && (
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}

        {error && (
          <p
            id={errorId}
            role="alert"
            aria-live="polite"
            className="flex items-center gap-1 text-sm text-red-600"
          >
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

ZipCodeInput.displayName = "ZipCodeInput";

export { ZipCodeInput };

