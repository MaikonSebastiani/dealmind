"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Pencil, MapPin, Calendar, Building, Calculator } from "lucide-react";
import { DeleteDealButton } from "./delete-button";
import { useLocale } from "@/contexts/locale-context";
import { formatCurrency } from "@/lib/i18n/currency";
import { calculateDealMetrics } from "@/lib/calculations/financing";

interface Deal {
  id: string;
  name: string;
  address: string | null;
  zipCode: string | null;
  propertyType: string;
  status: string;
  purchasePrice: number;
  estimatedCosts: number;
  monthlyExpenses: number;
  estimatedSalePrice: number;
  estimatedTimeMonths: number;
  useFinancing: boolean;
  downPayment: number | null;
  loanAmount: number | null;
  interestRate: number | null;
  loanTermYears: number | null;
  monthlyPayment: number | null;
  closingCosts: number | null;
  estimatedProfit: number | null;
  estimatedROI: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface DealDetailClientProps {
  deal: Deal;
}

export function DealDetailClient({ deal }: DealDetailClientProps) {
  const { t, locale } = useLocale();

  const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
    ANALYZING: { label: t("status.analyzing"), variant: "secondary" },
    APPROVED: { label: t("status.approved"), variant: "default" },
    REJECTED: { label: t("status.rejected"), variant: "destructive" },
    PURCHASED: { label: t("status.purchased"), variant: "default" },
    RENOVATING: { label: t("status.renovating"), variant: "secondary" },
    FOR_SALE: { label: t("status.forSale"), variant: "default" },
    SOLD: { label: t("status.sold"), variant: "default" },
  };

  const PROPERTY_TYPE_LABELS: Record<string, string> = {
    RESIDENTIAL: t("deal.propertyType.residential"),
    COMMERCIAL: t("deal.propertyType.commercial"),
    LAND: t("deal.propertyType.land"),
    INDUSTRIAL: t("deal.propertyType.industrial"),
    MIXED: t("deal.propertyType.mixed"),
  };

  const fmt = (value: number | null) => {
    if (value === null) return "-";
    return formatCurrency(value, locale);
  };

  const formatPercent = (value: number | null) => {
    if (value === null) return "-";
    return `${value.toFixed(1)}%`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  // Recalculate metrics for display
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

  const statusConfig = STATUS_CONFIG[deal.status] || STATUS_CONFIG.ANALYZING;

  return (
    <div className="space-y-6">
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

      {/* Summary Cards */}
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Financial Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>{t("detail.financialBreakdown")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {deal.useFinancing ? (
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
            ) : (
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

        {/* Deal Information */}
        <Card>
          <CardHeader>
            <CardTitle>{t("detail.dealInfo")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 py-2 border-b">
              <Building className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <div>
                <p className="text-sm text-muted-foreground">{t("detail.propertyType")}</p>
                <p className="font-medium">{PROPERTY_TYPE_LABELS[deal.propertyType] || deal.propertyType}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 py-2 border-b">
              <Calendar className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <div>
                <p className="text-sm text-muted-foreground">{t("detail.timeline")}</p>
                <p className="font-medium">{deal.estimatedTimeMonths} {t("detail.months")}</p>
              </div>
            </div>
            
            {deal.useFinancing && (
              <>
                <div className="flex items-center gap-3 py-2 border-b">
                  <Calculator className="h-5 w-5 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t("deal.financing.interestRate")}</p>
                    <p className="font-medium">{deal.interestRate}% {locale === "pt-BR" ? "a.a." : "APR"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-2 border-b">
                  <Calendar className="h-5 w-5 text-primary" aria-hidden="true" />
                  <div>
                    <p className="text-sm text-muted-foreground">{t("deal.financing.loanTerm")}</p>
                    <p className="font-medium">{deal.loanTermYears} {locale === "pt-BR" ? "anos" : "years"}</p>
                  </div>
                </div>
              </>
            )}
            
            <div className="flex items-center gap-3 py-2 border-b">
              <Calendar className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <div>
                <p className="text-sm text-muted-foreground">{t("detail.created")}</p>
                <p className="font-medium">{formatDate(deal.createdAt)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 py-2">
              <Calendar className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              <div>
                <p className="text-sm text-muted-foreground">{t("detail.lastUpdated")}</p>
                <p className="font-medium">{formatDate(deal.updatedAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {deal.notes && (
        <Card>
          <CardHeader>
            <CardTitle>{t("deal.notes")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{deal.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

