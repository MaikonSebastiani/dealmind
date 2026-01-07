"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Pencil, MapPin } from "lucide-react";
import { DeleteDealButton } from "@/app/(dashboard)/deals/[id]/delete-button";
import { getStatusConfig } from "../constants";
import type { SectionProps } from "../types";

export function DetailHeader({ deal, t }: SectionProps) {
  const statusConfig = getStatusConfig(deal.status, t);

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/deals" aria-label={t("common.back")}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">{deal.name}</h1>
            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
          </div>
          {(deal.address || deal.zipCode) && (
            <p className="mt-1 text-muted-foreground flex items-center gap-1">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {deal.address}{deal.address && deal.zipCode && " - "}{deal.zipCode}
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" asChild>
          <Link href={`/deals/${deal.id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
            {t("common.edit")}
          </Link>
        </Button>
        <DeleteDealButton dealId={deal.id} dealName={deal.name} />
      </div>
    </div>
  );
}

