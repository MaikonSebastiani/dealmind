"use client";

import { LocaleSelector } from "@/components/locale-selector";
import { useLocale } from "@/contexts/locale-context";

interface HeaderClientProps {
  userEmail?: string | null;
}

export function HeaderClient({ userEmail }: HeaderClientProps) {
  const { t } = useLocale();

  return (
    <div className="flex items-center gap-4">
      <LocaleSelector />
      
      {userEmail && (
        <span 
          className="text-sm text-muted-foreground hidden sm:inline"
          aria-label={`Logged in as ${userEmail}`}
        >
          {userEmail}
        </span>
      )}
    </div>
  );
}

