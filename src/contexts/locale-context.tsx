"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createTranslator, keyMapping, type LocaleCode } from "@/lib/i18n/translations";

// Re-export for convenience
export type { LocaleCode };

interface LocaleContextType {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
  children: ReactNode;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<LocaleCode>("en-US");
  const [mounted, setMounted] = useState(false);

  // Load locale from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("locale") as LocaleCode;
    if (saved && (saved === "en-US" || saved === "pt-BR")) {
      setLocaleState(saved);
    }
    setMounted(true);
  }, []);

  // Update HTML lang attribute when locale changes
  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale === "pt-BR" ? "pt-BR" : "en";
    }
  }, [locale, mounted]);

  // Save locale to localStorage when changed
  const setLocale = (newLocale: LocaleCode) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  // Create translator for current locale
  const translator = createTranslator(locale);

  // Translation function with backward compatibility for old flat keys
  const t = (key: string, params?: Record<string, string | number>): string => {
    // Try to map old key to new key structure
    const mappedKey = keyMapping[key] || key;
    return translator(mappedKey, params);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
