"use client";

import { useLocale } from "@/contexts/locale-context";
import { calculateDealMetrics } from "@/lib/calculations/financing";
import {
  DetailHeader,
  MetricsCards,
  PropertyCharacteristics,
  FinancialBreakdown,
  DealInfo,
  NotesSection,
} from "./sections";
import type { DealDetailProps } from "./types";

export function DealDetail({ deal }: DealDetailProps) {
  const { t, locale } = useLocale();

  // Calculate metrics for display
  const metrics = calculateDealMetrics({
    purchasePrice: deal.purchasePrice,
    estimatedCosts: deal.estimatedCosts,
    monthlyExpenses: deal.monthlyExpenses,
    estimatedSalePrice: deal.estimatedSalePrice,
    estimatedTimeMonths: deal.estimatedTimeMonths,
    useFinancing: deal.useFinancing,
    downPayment: deal.downPayment ?? 0,
    interestRate: deal.interestRate ?? 0,
    loanTermYears: deal.loanTermYears ?? 30,
    closingCosts: deal.closingCosts ?? 0,
  });

  // Common props for sections
  const sectionProps = { deal, locale, t };
  const metricsProps = { ...sectionProps, metrics };

  return (
    <div className="space-y-6">
      <DetailHeader {...sectionProps} />

      <MetricsCards {...metricsProps} />

      <PropertyCharacteristics {...sectionProps} />

      <div className="grid gap-6 lg:grid-cols-2">
        <FinancialBreakdown {...metricsProps} />
        <DealInfo {...sectionProps} />
      </div>

      <NotesSection deal={deal} t={t} />
    </div>
  );
}

