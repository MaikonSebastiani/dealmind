"use client";

import * as React from "react";
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getZipCodeConfig, formatZipCode } from "@/lib/i18n/zipcode";
import { useAddressLookup } from "@/hooks/use-address-lookup";
import type { LocaleCode } from "@/lib/i18n/currency";
import type { AddressData } from "@/lib/services/viacep";

export interface ZipCodeInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  id: string;
  label?: string;
  error?: string;
  description?: string;
  locale?: LocaleCode;
  value?: string;
  onChange?: (value: string) => void;
  /** Callback when address is found via ZIP code lookup */
  onAddressFound?: (address: AddressData) => void;
  /** Show address lookup feature (only works for pt-BR) */
  enableLookup?: boolean;
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
      onAddressFound,
      enableLookup = true,
      disabled,
      ...props
    },
    ref
  ) => {
    const config = getZipCodeConfig(locale);
    const errorId = error ? `${id}-error` : undefined;
    const descriptionId = description ? `${id}-description` : undefined;
    
    const { 
      lookup, 
      isLoading, 
      error: lookupError, 
      address,
      isSupported 
    } = useAddressLookup({
      onSuccess: (addr) => {
        onAddressFound?.(addr);
      },
    });

    // Track if we've already looked up this CEP
    const lastLookedUpRef = React.useRef<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const formatted = formatZipCode(inputValue, locale);
      onChange?.(formatted);
    };

    // Lookup address when CEP is complete (on blur or when typing completes)
    const handleBlur = async () => {
      if (!enableLookup || !isSupported || !value) return;
      
      // Clean the value to compare
      const cleanedValue = value.replace(/\D/g, "");
      
      // Only lookup if we have 8 digits and haven't looked up this CEP yet
      if (cleanedValue.length === 8 && cleanedValue !== lastLookedUpRef.current) {
        lastLookedUpRef.current = cleanedValue;
        await lookup(cleanedValue);
      }
    };

    // Use custom label from config if no label prop provided
    const displayLabel = label ?? config.label;

    // Show success state when address is found
    const showSuccess = address && !error && !lookupError;
    const displayError = error || lookupError;

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
            onBlur={handleBlur}
            placeholder={config.placeholder}
            maxLength={config.maxLength}
            disabled={disabled || isLoading}
            aria-invalid={displayError ? "true" : "false"}
            aria-describedby={
              [errorId, descriptionId].filter(Boolean).join(" ") || undefined
            }
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
              "placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-colors",
              displayError && "border-red-500 pr-10 focus-visible:ring-red-500",
              showSuccess && "border-green-500 pr-10",
              className
            )}
            {...props}
          />

          {/* Loading indicator */}
          {isLoading && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <Loader2
                className="h-5 w-5 text-primary animate-spin"
                aria-hidden="true"
              />
            </div>
          )}

          {/* Success indicator */}
          {showSuccess && !isLoading && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <CheckCircle2
                className="h-5 w-5 text-green-500"
                aria-hidden="true"
              />
            </div>
          )}

          {/* Error indicator */}
          {displayError && !isLoading && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <AlertCircle
                className="h-5 w-5 text-red-500"
                aria-hidden="true"
              />
            </div>
          )}
        </div>

        {/* Address preview when found */}
        {showSuccess && address && (
          <p className="text-sm text-green-600 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
            {address.neighborhood}, {address.city} - {address.stateCode}
          </p>
        )}

        {description && !displayError && !showSuccess && (
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}

        {displayError && (
          <p
            id={errorId}
            role="alert"
            aria-live="polite"
            className="flex items-center gap-1 text-sm text-red-600"
          >
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            {displayError}
          </p>
        )}
      </div>
    );
  }
);

ZipCodeInput.displayName = "ZipCodeInput";

export { ZipCodeInput };
