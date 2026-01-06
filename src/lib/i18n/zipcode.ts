/**
 * ZIP Code configuration for internationalization
 * 
 * To change the default locale:
 * 1. Update DEFAULT_LOCALE in currency.ts (shared)
 * 2. Or set NEXT_PUBLIC_LOCALE in .env
 * 
 * To add new locales:
 * 1. Add a new entry to ZIPCODE_CONFIG
 */

import { LocaleCode, DEFAULT_LOCALE } from "./currency";

export interface ZipCodeConfig {
  locale: string;
  label: string;
  placeholder: string;
  format: string; // # = digit, A = letter, ? = any
  mask?: string; // Visual mask character
  maxLength: number;
}

export const ZIPCODE_CONFIG: Record<LocaleCode, ZipCodeConfig> = {
  "en-US": {
    locale: "en-US",
    label: "ZIP Code",
    placeholder: "12345",
    format: "#####-####", // 5 digits or 5+4
    maxLength: 10,
  },
  "pt-BR": {
    locale: "pt-BR",
    label: "CEP",
    placeholder: "12345-678",
    format: "#####-###",
    maxLength: 9,
  },
  "en-GB": {
    locale: "en-GB",
    label: "Postcode",
    placeholder: "SW1A 1AA",
    format: "????-???", // Complex UK format - allow any
    maxLength: 8,
  },
  "de-DE": {
    locale: "de-DE",
    label: "PLZ",
    placeholder: "12345",
    format: "#####",
    maxLength: 5,
  },
  "ja-JP": {
    locale: "ja-JP",
    label: "郵便番号",
    placeholder: "123-4567",
    format: "###-####",
    maxLength: 8,
  },
};

export function getZipCodeConfig(locale?: LocaleCode): ZipCodeConfig {
  return ZIPCODE_CONFIG[locale || DEFAULT_LOCALE];
}

/**
 * Format a ZIP code string based on locale
 * Automatically adds separators as user types
 */
export function formatZipCode(value: string, locale?: LocaleCode): string {
  const config = getZipCodeConfig(locale);
  
  // Remove all non-alphanumeric characters
  const cleaned = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  
  if (!cleaned) return "";
  
  // Apply format based on locale
  switch (locale || DEFAULT_LOCALE) {
    case "en-US":
      // US: 12345 or 12345-6789
      if (cleaned.length <= 5) {
        return cleaned;
      }
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 9)}`;
    
    case "pt-BR":
      // Brazil: 12345-678
      if (cleaned.length <= 5) {
        return cleaned;
      }
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
    
    case "en-GB":
      // UK: Complex format - just uppercase, no auto-format
      // Formats vary: A9 9AA, A99 9AA, A9A 9AA, AA9 9AA, AA99 9AA, AA9A 9AA
      if (cleaned.length <= 4) {
        return cleaned;
      }
      // Add space before last 3 characters
      const outward = cleaned.slice(0, -3);
      const inward = cleaned.slice(-3);
      return `${outward} ${inward}`;
    
    case "de-DE":
      // Germany: 12345 (no separator)
      return cleaned.slice(0, 5);
    
    case "ja-JP":
      // Japan: 123-4567
      if (cleaned.length <= 3) {
        return cleaned;
      }
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}`;
    
    default:
      return cleaned;
  }
}

/**
 * Validate ZIP code format based on locale
 */
export function validateZipCode(value: string, locale?: LocaleCode): boolean {
  if (!value) return true; // Empty is valid (optional field)
  
  const cleaned = value.replace(/[^a-zA-Z0-9]/g, "");
  
  switch (locale || DEFAULT_LOCALE) {
    case "en-US":
      // US: 5 digits or 9 digits (ZIP+4)
      return /^\d{5}$/.test(cleaned) || /^\d{9}$/.test(cleaned);
    
    case "pt-BR":
      // Brazil: 8 digits
      return /^\d{8}$/.test(cleaned);
    
    case "en-GB":
      // UK: Complex validation
      const ukPattern = /^[A-Z]{1,2}\d[A-Z\d]?\d[A-Z]{2}$/;
      return ukPattern.test(cleaned);
    
    case "de-DE":
      // Germany: 5 digits
      return /^\d{5}$/.test(cleaned);
    
    case "ja-JP":
      // Japan: 7 digits
      return /^\d{7}$/.test(cleaned);
    
    default:
      return cleaned.length > 0;
  }
}

/**
 * Get the raw value without formatting
 */
export function parseZipCode(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

