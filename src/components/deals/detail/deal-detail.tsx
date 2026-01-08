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
  AIAnalysisSection,
  DocumentsSection,
} from "./sections";
import type { DealDetailProps } from "./types";

export function DealDetail({ deal }: DealDetailProps) {
  const { t, locale } = useLocale();

  // Calculate metrics for display
  const metrics = calculateDealMetrics({
    purchasePrice: deal.purchasePrice,
    estimatedCosts: deal.estimatedCosts,
    monthlyExpenses: deal.monthlyExpenses,
    propertyDebts: deal.propertyDebts ?? 0,
    estimatedSalePrice: deal.estimatedSalePrice,
    estimatedTimeMonths: deal.estimatedTimeMonths,
    acquisitionType: deal.acquisitionType as "TRADITIONAL" | "AUCTION" | "AUCTION_NO_FEE",
    isFirstProperty: deal.isFirstProperty,
    useFinancing: deal.useFinancing,
    amortizationType: deal.amortizationType as "SAC" | "PRICE",
    downPayment: deal.downPayment ?? 0,
    interestRate: deal.interestRate ?? 0,
    loanTermYears: deal.loanTermYears ?? 30,
    closingCosts: deal.closingCosts ?? 0,
    locale,
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

      {/* Documents Section */}
      {deal.documents && deal.documents.length > 0 && (
        <DocumentsSection 
          documents={deal.documents} 
          locale={locale} 
          t={t} 
        />
      )}

      <AIAnalysisSection 
        dealId={deal.id} 
        dealStatus={deal.status} 
        locale={locale} 
        t={t} 
      />

      <NotesSection deal={deal} t={t} />
    </div>
  );
}

