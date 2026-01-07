"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/i18n/currency";
import type { PreviewPanelProps } from "../types";

export function PreviewPanel({ metrics, values, locale, t }: PreviewPanelProps) {
  const fmt = (value: number) => formatCurrency(value, locale);
  const { 
    purchasePrice, 
    estimatedCosts, 
    monthlyExpenses,
    propertyDebts,
    estimatedTimeMonths, 
    useFinancing, 
    downPayment, 
    closingCosts,
    isFirstProperty,
  } = values;

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" aria-hidden="true" />
          {t("deal.section.preview")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Investment Breakdown */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">
            {locale === "pt-BR" ? "Capital Necessário" : "Cash Needed"}
          </h4>
          
          {useFinancing ? (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("deal.financing.downPayment")}</span>
                <span>{fmt(downPayment)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("deal.renovationCosts")}</span>
                <span>{fmt(estimatedCosts)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("deal.financing.closingCosts")}</span>
                <span>{fmt(closingCosts)}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("preview.purchasePrice")}</span>
                <span>{fmt(purchasePrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("preview.renovationCosts")}</span>
                <span>{fmt(estimatedCosts)}</span>
              </div>
            </>
          )}
          
          <div className="border-t pt-2 flex justify-between font-medium">
            <span>{locale === "pt-BR" ? "Total Investido" : "Total Cash Invested"}</span>
            <span>{fmt(metrics.totalCashInvested)}</span>
          </div>
        </div>

        {/* Holding Costs */}
        <div className="space-y-2 border-t pt-4">
          <h4 className="text-sm font-medium text-muted-foreground">
            {locale === "pt-BR" 
              ? `Custos (${estimatedTimeMonths} meses)` 
              : `Holding Costs (${estimatedTimeMonths}mo)`}
          </h4>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {t("deal.monthlyExpenses")} × {estimatedTimeMonths}
            </span>
            <span>{fmt(monthlyExpenses * estimatedTimeMonths)}</span>
          </div>
          
          {useFinancing && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {t("deal.financing.monthlyPayment")} × {estimatedTimeMonths}
              </span>
              <span>{fmt(metrics.monthlyPayment * estimatedTimeMonths)}</span>
            </div>
          )}
          
          <div className="flex justify-between text-sm font-medium">
            <span>{locale === "pt-BR" ? "Total Custos" : "Total Costs"}</span>
            <span>{fmt(metrics.totalHoldingCosts)}</span>
          </div>
        </div>

        {/* Sale & Profit */}
        <div className="space-y-2 border-t pt-4">
          <h4 className="text-sm font-medium text-muted-foreground">
            {locale === "pt-BR" ? "Na Venda" : "At Sale"}
          </h4>
          
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("preview.salePrice")}</span>
            <span>{fmt(metrics.grossProceeds)}</span>
          </div>
          
          {useFinancing && metrics.loanAmount > 0 && (
            <div className="flex justify-between text-sm text-amber-600">
              <span>{t("preview.loanPayoff")}</span>
              <span>- {fmt(metrics.loanAmount)}</span>
            </div>
          )}
          
          {/* Capital Gains Tax (Brazil only, non-first property) */}
          {!isFirstProperty && locale === "pt-BR" && metrics.capitalGainsTax > 0 && (
            <div className="flex justify-between text-sm text-red-500">
              <span>{locale === "pt-BR" ? "Imposto Ganho Capital (15%)" : "Capital Gains Tax"}</span>
              <span>- {fmt(metrics.capitalGainsTax)}</span>
            </div>
          )}
          
          <div className="flex justify-between font-medium pt-2 border-t">
            <span>
              {locale === "pt-BR" && !isFirstProperty 
                ? "Lucro Líquido" 
                : t("preview.estimatedProfit")}
            </span>
            <span className={metrics.estimatedProfit >= 0 ? "text-green-600" : "text-red-600"}>
              {fmt(metrics.estimatedProfit)}
            </span>
          </div>
        </div>

        {/* ROI */}
        <div className="border-t pt-4 bg-muted/30 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
          <div className="flex justify-between items-center">
            <div>
              <span className="font-medium">{t("preview.roi")}</span>
              {useFinancing && (
                <p className="text-xs text-muted-foreground">
                  {locale === "pt-BR" 
                    ? "Retorno sobre capital próprio" 
                    : "Return on your cash"}
                </p>
              )}
            </div>
            <span className={`text-3xl font-bold ${metrics.estimatedROI >= 0 ? "text-green-600" : "text-red-600"}`}>
              {metrics.estimatedROI.toFixed(1)}%
            </span>
          </div>
          
          {/* Sales tax warning - Only show for USA since Brazil is auto-calculated */}
          {!isFirstProperty && locale === "en-US" && (
            <div className="mt-3 pt-3 border-t border-border/50 flex items-start gap-2 text-xs text-amber-600">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>* Consider capital gains taxes at sale</span>
            </div>
          )}

          {/* Property debts warning */}
          {propertyDebts > 0 && (
            <div className="mt-2 flex items-start gap-2 text-xs text-muted-foreground">
              <span>
                {locale === "pt-BR" 
                  ? `* Dívidas do imóvel: ${fmt(propertyDebts)} (incluídas no investimento)`
                  : `* Property debts: ${fmt(propertyDebts)} (included in investment)`}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

