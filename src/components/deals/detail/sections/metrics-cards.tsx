"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/i18n/currency";
import type { SectionWithMetricsProps, Deal } from "../types";

interface MetricsCardsProps extends SectionWithMetricsProps {
  deal: Deal;
}

export function MetricsCards({ deal, metrics, locale, t }: MetricsCardsProps) {
  const fmt = (value: number | null) => {
    if (value === null) return "-";
    return formatCurrency(value, locale);
  };

  const formatPercent = (value: number | null) => {
    if (value === null) return "-";
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("detail.totalInvestment")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{fmt(metrics.totalCashInvested)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("detail.estimatedSalePrice")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{fmt(deal.estimatedSalePrice)}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("detail.estimatedProfit")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold ${metrics.estimatedProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
            {fmt(metrics.estimatedProfit)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("detail.estimatedROI")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold ${metrics.estimatedROI >= 0 ? "text-green-600" : "text-red-600"}`}>
            {formatPercent(metrics.estimatedROI)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

