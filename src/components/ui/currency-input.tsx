"use client";

import * as React from "react";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCurrencyConfig, LocaleCode } from "@/lib/i18n/currency";

export interface CurrencyInputProps
  extends Omit<NumericFormatProps, "value" | "onValueChange"> {
  id: string;
  label?: string;
  error?: string;
  description?: string;
  locale?: LocaleCode;
  value?: number;
  onValueChange?: (value: number) => void;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    {
      className,
      id,
      label,
      error,
      description,
      locale,
      value,
      onValueChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const config = getCurrencyConfig(locale);
    const errorId = error ? `${id}-error` : undefined;
    const descriptionId = description ? `${id}-description` : undefined;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <NumericFormat
            id={id}
            getInputRef={ref}
            value={value}
            onValueChange={(values) => {
              onValueChange?.(values.floatValue ?? 0);
            }}
            thousandSeparator={config.thousandSeparator}
            decimalSeparator={config.decimalSeparator}
            prefix={config.prefix}
            suffix={config.suffix}
            decimalScale={config.decimalScale}
            fixedDecimalScale
            allowNegative={false}
            disabled={disabled}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              [errorId, descriptionId].filter(Boolean).join(" ") || undefined
            }
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
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

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput };

