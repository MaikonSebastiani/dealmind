"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Calendar, Calculator } from "lucide-react";
import { getPropertyTypeLabel } from "../constants";
import type { SectionProps } from "../types";

export function DealInfo({ deal, locale, t }: SectionProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("detail.dealInfo")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <InfoItem
          icon={<Building className="h-5 w-5 text-muted-foreground" aria-hidden="true" />}
          label={t("detail.propertyType")}
          value={getPropertyTypeLabel(deal.propertyType, t)}
        />
        
        <InfoItem
          icon={<Calendar className="h-5 w-5 text-muted-foreground" aria-hidden="true" />}
          label={t("detail.timeline")}
          value={`${deal.estimatedTimeMonths} ${t("detail.months")}`}
        />
        
        {deal.useFinancing && (
          <>
            <InfoItem
              icon={<Calculator className="h-5 w-5 text-primary" aria-hidden="true" />}
              label={t("deal.financing.interestRate")}
              value={`${deal.interestRate}% ${locale === "pt-BR" ? "a.a." : "APR"}`}
            />
            <InfoItem
              icon={<Calendar className="h-5 w-5 text-primary" aria-hidden="true" />}
              label={t("deal.financing.loanTerm")}
              value={`${deal.loanTermYears} ${locale === "pt-BR" ? "anos" : "years"}`}
            />
          </>
        )}
        
        <InfoItem
          icon={<Calendar className="h-5 w-5 text-muted-foreground" aria-hidden="true" />}
          label={t("detail.created")}
          value={formatDate(deal.createdAt)}
        />
        
        <InfoItem
          icon={<Calendar className="h-5 w-5 text-muted-foreground" aria-hidden="true" />}
          label={t("detail.lastUpdated")}
          value={formatDate(deal.updatedAt)}
          isLast
        />
      </CardContent>
    </Card>
  );
}

// Sub-component for info items
interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLast?: boolean;
}

function InfoItem({ icon, label, value, isLast }: InfoItemProps) {
  return (
    <div className={`flex items-center gap-3 py-2 ${!isLast ? "border-b" : ""}`}>
      {icon}
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

