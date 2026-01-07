"use client";

import { useLocale, LocaleCode } from "@/contexts/locale-context";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const locales: { code: LocaleCode; name: string; flag: string }[] = [
  { code: "en-US", name: "English (US)", flag: "🇺🇸" },
  { code: "pt-BR", name: "Português (BR)", flag: "🇧🇷" },
];

export function LocaleSelector() {
  const { locale, setLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLocale = locales.find((l) => l.code === locale) || locales[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (code: LocaleCode) => {
    setLocale(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        aria-label="Select language"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="text-lg" role="img" aria-label={currentLocale.name}>
          {currentLocale.flag}
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 top-full z-50 mt-1 min-w-[200px] rounded-md border bg-popover shadow-lg"
          role="listbox"
          aria-label="Available languages"
        >
          {locales.map((l) => (
            <button
              key={l.code}
              onClick={() => handleSelect(l.code)}
              className={`flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-accent ${
                l.code === locale ? "bg-accent font-medium" : ""
              }`}
              role="option"
              aria-selected={l.code === locale}
            >
              <span className="text-lg" role="img" aria-hidden="true">
                {l.flag}
              </span>
              <span>{l.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

