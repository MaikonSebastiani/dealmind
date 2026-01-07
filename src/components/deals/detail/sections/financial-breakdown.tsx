"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { formatCurrency } from "@/lib/i18n/currency";
import type { SectionWithMetricsProps } from "../types";

export function FinancialBreakdown({ deal, metrics, locale, t }: SectionWithMetricsProps) {
  const fmt = (value: number | null) => {
    if (value === null) return "-";
    return formatCurrency(value, locale);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("detail.financialBreakdown")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {deal.useFinancing ? (
          <FinancingBreakdown deal={deal} metrics={metrics} locale={locale} t={t} fmt={fmt} />
        ) : (
          <CashBreakdown deal={deal} t={t} fmt={fmt} />
        )}
        
        <div className="flex justify-between py-2 border-b">
          <span className="text-muted-foreground text-sm">
            {t("deal.monthlyExpenses")} × {deal.estimatedTimeMonths}mo
          </span>
          <span className="font-medium">{fmt(deal.monthlyExpenses * deal.estimatedTimeMonths)}</span>
        </div>
        
        <div className="flex justify-between py-2 border-b">
          <span className="text-muted-foreground">{t("preview.salePrice")}</span>
          <span className="font-medium">{fmt(deal.estimatedSalePrice)}</span>
        </div>
        
        {deal.useFinancing && (
          <div className="flex justify-between py-2 border-b text-amber-600">
            <span>{t("preview.loanPayoff")}</span>
            <span>- {fmt(deal.loanAmount)}</span>
          </div>
        )}
        
        <div className="flex justify-between py-2 bg-muted/30 px-2 rounded">
          <span className="font-medium">{t("preview.estimatedProfit")}</span>
          <span className={`font-bold ${metrics.estimatedProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
            {fmt(metrics.estimatedProfit)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// Sub-component for financing breakdown
interface BreakdownProps extends SectionWithMetricsProps {
  fmt: (value: number | null) => string;
}

function FinancingBreakdown({ deal, metrics, locale, t, fmt }: BreakdownProps) {
  return (
    <>
      <div className="flex justify-between py-2 border-b">
        <span className="text-muted-foreground">{t("deal.financing.downPayment")}</span>
        <span className="font-medium">{fmt(deal.downPayment)}</span>
      </div>
      <div className="flex justify-between py-2 border-b">
        <span className="text-muted-foreground">{t("deal.renovationCosts")}</span>
        <span className="font-medium">{fmt(deal.estimatedCosts)}</span>
      </div>
      <div className="flex justify-between py-2 border-b">
        <span className="text-muted-foreground">{t("deal.financing.closingCosts")}</span>
        <span className="font-medium">{fmt(deal.closingCosts)}</span>
      </div>
      <div className="flex justify-between py-2 border-b bg-muted/30 px-2 rounded">
        <span className="font-medium">{locale === "pt-BR" ? "Capital Investido" : "Cash Invested"}</span>
        <span className="font-bold">{fmt(metrics.totalCashInvested)}</span>
      </div>
      <div className="flex justify-between py-2 border-b text-primary">
        <span className="flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          {t("deal.financing.loanAmount")}
        </span>
        <span className="font-medium">{fmt(deal.loanAmount)}</span>
      </div>
      <div className="flex justify-between py-2 border-b text-sm">
        <span className="text-muted-foreground">
          {t("deal.financing.monthlyPayment")} × {deal.estimatedTimeMonths}mo
        </span>
        <span>{fmt((deal.monthlyPayment || 0) * deal.estimatedTimeMonths)}</span>
      </div>
    </>
  );
}

// Sub-component for cash breakdown
interface CashBreakdownProps {
  deal: SectionWithMetricsProps["deal"];
  t: SectionWithMetricsProps["t"];
  fmt: (value: number | null) => string;
}

function CashBreakdown({ deal, t, fmt }: CashBreakdownProps) {
  return (
    <>
      <div className="flex justify-between py-2 border-b">
        <span className="text-muted-foreground">{t("deal.purchasePrice")}</span>
        <span className="font-medium">{fmt(deal.purchasePrice)}</span>
      </div>
      <div className="flex justify-between py-2 border-b">
        <span className="text-muted-foreground">{t("deal.renovationCosts")}</span>
        <span className="font-medium">{fmt(deal.estimatedCosts)}</span>
      </div>
    </>
  );
}

