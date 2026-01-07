"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/i18n/currency";
import type { SectionWithMetricsProps } from "../types";

export function FinancialBreakdown({ deal, metrics, locale, t }: SectionWithMetricsProps) {
  const fmt = (value: number | null) => {
    if (value === null) return "-";
    return formatCurrency(value, locale);
  };

  const showCapitalGainsTax = !deal.isFirstProperty && locale === "pt-BR" && metrics.capitalGainsTax > 0;

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
        
        {/* Property Debts */}
        {(deal.propertyDebts ?? 0) > 0 && (
          <div className="flex justify-between py-2 border-b text-amber-600">
            <span className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {t("deal.propertyDebts")}
            </span>
            <span className="font-medium">{fmt(deal.propertyDebts)}</span>
          </div>
        )}
        
        {/* Monthly Expenses */}
        <div className="flex justify-between py-2 border-b">
          <span className="text-muted-foreground text-sm">
            {t("deal.monthlyExpenses")} × {deal.estimatedTimeMonths}mo
          </span>
          <span className="font-medium">{fmt(deal.monthlyExpenses * deal.estimatedTimeMonths)}</span>
        </div>
        
        {/* Total Investment */}
        <div className="flex justify-between py-2 border-b bg-muted/30 px-2 rounded">
          <span className="font-medium">{t("preview.totalInvestment")}</span>
          <span className="font-bold">{fmt(metrics.totalCashInvested)}</span>
        </div>
        
        {/* Sale Price */}
        <div className="flex justify-between py-2 border-b">
          <span className="text-muted-foreground">{t("preview.salePrice")}</span>
          <span className="font-medium text-green-600">{fmt(deal.estimatedSalePrice)}</span>
        </div>
        
        {/* Loan Payoff (if financed) */}
        {deal.useFinancing && deal.loanAmount && (
          <div className="flex justify-between py-2 border-b text-amber-600">
            <span>{t("preview.loanPayoff")}</span>
            <span>- {fmt(deal.loanAmount)}</span>
          </div>
        )}
        
        {/* Capital Gains Tax (Brazil, non-first property) */}
        {showCapitalGainsTax && (
          <div className="flex justify-between py-2 border-b text-red-600">
            <span className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {t("preview.capitalGainsTax")} (15%)
            </span>
            <span>- {fmt(metrics.capitalGainsTax)}</span>
          </div>
        )}
        
        {/* Estimated Profit */}
        <div className="flex justify-between py-2 bg-muted/30 px-2 rounded">
          <span className="font-medium">
            {showCapitalGainsTax ? t("preview.netProfit") : t("preview.estimatedProfit")}
          </span>
          <span className={`font-bold ${metrics.estimatedProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
            {fmt(metrics.estimatedProfit)}
          </span>
        </div>
        
        {/* ROI */}
        <div className="flex justify-between py-2 bg-primary/10 px-2 rounded">
          <span className="font-medium text-primary">ROI (Cash-on-Cash)</span>
          <span className={`font-bold ${metrics.estimatedROI >= 0 ? "text-green-600" : "text-red-600"}`}>
            {metrics.estimatedROI.toFixed(1)}%
          </span>
        </div>
        
        {/* Tax Warning for US */}
        {!deal.isFirstProperty && locale === "en-US" && (
          <div className="flex items-start gap-2 text-xs text-amber-600 mt-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <span>{t("preview.capitalGainsTaxWarning")}</span>
          </div>
        )}
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
