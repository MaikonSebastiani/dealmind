"use client";

import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FormSectionProps } from "../types";

export function NotesSection({ register, t }: Pick<FormSectionProps, "register" | "t">) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("deal.section.notes")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          id="notes"
          placeholder={t("deal.notes.placeholder")}
          className="min-h-[100px]"
          {...register("notes")}
        />
      </CardContent>
    </Card>
  );
}

