"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SectionProps } from "../types";

export function NotesSection({ deal, t }: Pick<SectionProps, "deal" | "t">) {
  if (!deal.notes) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("deal.notes")}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground whitespace-pre-wrap">{deal.notes}</p>
      </CardContent>
    </Card>
  );
}

