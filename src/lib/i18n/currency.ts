/**
 * Currency configuration for internationalization
 * 
 * To change the default currency:
 * 1. Update DEFAULT_LOCALE below
 * 2. Or set NEXT_PUBLIC_LOCALE in .env
 * 
 * To add new locales:
 * 1. Add a new entry to CURRENCY_CONFIG
 */

export type LocaleCode = "en-US" | "pt-BR" | "en-GB" | "de-DE" | "ja-JP";

export interface CurrencyConfig {
  locale: string;
  currency: string;
  symbol: string;
  thousandSeparator: string;
  decimalSeparator: string;
  prefix: string;
  suffix: string;
  decimalScale: number;
}

export const CURRENCY_CONFIG: Record<LocaleCode, CurrencyConfig> = {
  "en-US": {
    locale: "en-US",
    currency: "USD",
    symbol: "$",
    thousandSeparator: ",",
    decimalSeparator: ".",
    prefix: "$ ",
    suffix: "",
    decimalScale: 2,
  },
  "pt-BR": {
    locale: "pt-BR",
    currency: "BRL",
    symbol: "R$",
    thousandSeparator: ".",
    decimalSeparator: ",",
    prefix: "R$ ",
    suffix: "",
    decimalScale: 2,
  },
  "en-GB": {
    locale: "en-GB",
    currency: "GBP",
    symbol: "£",
    thousandSeparator: ",",
    decimalSeparator: ".",
    prefix: "£ ",
    suffix: "",
    decimalScale: 2,
  },
  "de-DE": {
    locale: "de-DE",
    currency: "EUR",
    symbol: "€",
    thousandSeparator: ".",
    decimalSeparator: ",",
    prefix: "",
    suffix: " €",
    decimalScale: 2,
  },
  "ja-JP": {
    locale: "ja-JP",
    currency: "JPY",
    symbol: "¥",
    thousandSeparator: ",",
    decimalSeparator: ".",
    prefix: "¥ ",
    suffix: "",
    decimalScale: 0, // JPY doesn't use decimal places
  },
};

// Default locale - can be overridden by NEXT_PUBLIC_LOCALE env var
export const DEFAULT_LOCALE: LocaleCode = 
  (process.env.NEXT_PUBLIC_LOCALE as LocaleCode) || "en-US";

export function getCurrencyConfig(locale?: LocaleCode): CurrencyConfig {
  return CURRENCY_CONFIG[locale || DEFAULT_LOCALE];
}

// Format a number as currency string (for display)
export function formatCurrency(
  value: number,
  locale?: LocaleCode
): string {
  const config = getCurrencyConfig(locale);
  
  return new Intl.NumberFormat(config.locale, {
    style: "currency",
    currency: config.currency,
    minimumFractionDigits: config.decimalScale,
    maximumFractionDigits: config.decimalScale,
  }).format(value);
}

// Parse a formatted currency string back to number
export function parseCurrency(
  value: string,
  locale?: LocaleCode
): number {
  const config = getCurrencyConfig(locale);
  
  // Remove currency symbols, thousand separators, and spaces
  let cleanValue = value
    .replace(config.symbol, "")
    .replace(config.prefix.trim(), "")
    .replace(config.suffix.trim(), "")
    .replace(new RegExp(`\\${config.thousandSeparator}`, "g"), "")
    .replace(config.decimalSeparator, ".")
    .trim();
  
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
}

