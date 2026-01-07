"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDealSchema } from "@/lib/validations/deal";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { ZipCodeInput } from "@/components/ui/zipcode-input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calculator, TrendingUp, AlertTriangle, Home } from "lucide-react";
import { useLocale } from "@/contexts/locale-context";
import { formatCurrency } from "@/lib/i18n/currency";
import { 
  calculateDealMetrics, 
  getDefaultInterestRate, 
  getLoanTermOptions 
} from "@/lib/calculations/financing";

interface EditDealPageProps {
  params: Promise<{ id: string }>;
}

export default function EditDealPage({ params }: EditDealPageProps) {
  const router = useRouter();
  const { t, locale } = useLocale();
  const [dealId, setDealId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [generalError, setGeneralError] = useState<string | null>(null);

  // Get locale-specific defaults
  const defaultInterestRate = getDefaultInterestRate(locale);
  const loanTermOptions = getLoanTermOptions(locale);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createDealSchema),
    defaultValues: {
      name: "",
      address: "",
      zipCode: "",
      propertyType: "RESIDENTIAL" as const,
      area: null as number | null,
      bedrooms: null as number | null,
      bathrooms: null as number | null,
      parkingSpaces: null as number | null,
      lotSize: null as number | null,
      yearBuilt: null as number | null,
      condition: null as "NEW" | "EXCELLENT" | "GOOD" | "FAIR" | "NEEDS_WORK" | null,
      purchasePrice: 0,
      estimatedCosts: 0,
      monthlyExpenses: 0,
      estimatedSalePrice: 0,
      estimatedTimeMonths: 12,
      useFinancing: false,
      downPayment: 0,
      interestRate: defaultInterestRate,
      loanTermYears: 30,
      closingCosts: 0,
      notes: "",
    },
  });

  useEffect(() => {
    async function loadDeal() {
      const { id } = await params;
      setDealId(id);

      try {
        const response = await fetch(`/api/deals/${id}`);
        
        if (!response.ok) {
          setGeneralError(t("deal.notFound"));
          setIsLoading(false);
          return;
        }

        const { deal } = await response.json();
        
        reset({
          name: deal.name,
          address: deal.address || "",
          zipCode: deal.zipCode || "",
          propertyType: deal.propertyType,
          // Property characteristics
          area: deal.area ? Number(deal.area) : null,
          bedrooms: deal.bedrooms,
          bathrooms: deal.bathrooms,
          parkingSpaces: deal.parkingSpaces,
          lotSize: deal.lotSize ? Number(deal.lotSize) : null,
          yearBuilt: deal.yearBuilt,
          condition: deal.condition,
          // Financial
          purchasePrice: Number(deal.purchasePrice),
          estimatedCosts: Number(deal.estimatedCosts),
          monthlyExpenses: Number(deal.monthlyExpenses),
          estimatedSalePrice: Number(deal.estimatedSalePrice),
          estimatedTimeMonths: deal.estimatedTimeMonths,
          useFinancing: deal.useFinancing || false,
          downPayment: Number(deal.downPayment) || 0,
          interestRate: Number(deal.interestRate) || defaultInterestRate,
          loanTermYears: deal.loanTermYears || 30,
          closingCosts: Number(deal.closingCosts) || 0,
          notes: deal.notes || "",
        });
      } catch {
        setGeneralError(t("common.error"));
      } finally {
        setIsLoading(false);
      }
    }

    loadDeal();
  }, [params, reset, t, defaultInterestRate]);

  // Watch all values for calculations
  const purchasePrice = watch("purchasePrice") || 0;
  const estimatedCosts = watch("estimatedCosts") || 0;
  const monthlyExpenses = watch("monthlyExpenses") || 0;
  const estimatedSalePrice = watch("estimatedSalePrice") || 0;
  const estimatedTimeMonths = watch("estimatedTimeMonths") || 12;
  const useFinancing = watch("useFinancing") || false;
  const downPayment = watch("downPayment") || 0;
  const interestRate = watch("interestRate") || defaultInterestRate;
  const loanTermYears = watch("loanTermYears") || 30;
  const closingCosts = watch("closingCosts") || 0;

  // Use centralized calculation
  const metrics = calculateDealMetrics({
    purchasePrice,
    estimatedCosts,
    monthlyExpenses,
    estimatedSalePrice,
    estimatedTimeMonths,
    useFinancing,
    downPayment,
    interestRate,
    loanTermYears,
    closingCosts,
  });

  // Property types with translations
  const PROPERTY_TYPES = [
    { value: "RESIDENTIAL", label: t("deal.propertyType.residential") },
    { value: "COMMERCIAL", label: t("deal.propertyType.commercial") },
    { value: "LAND", label: t("deal.propertyType.land") },
    { value: "INDUSTRIAL", label: t("deal.propertyType.industrial") },
    { value: "MIXED", label: t("deal.propertyType.mixed") },
  ];

  // Property conditions with translations
  const PROPERTY_CONDITIONS = [
    { value: "NEW", label: t("deal.condition.new") },
    { value: "EXCELLENT", label: t("deal.condition.excellent") },
    { value: "GOOD", label: t("deal.condition.good") },
    { value: "FAIR", label: t("deal.condition.fair") },
    { value: "NEEDS_WORK", label: t("deal.condition.needsWork") },
  ];

  // Area unit based on locale
  const areaUnit = locale === "pt-BR" ? t("deal.area.unit") : t("deal.area.unitUS");

  const onSubmit = async (data: Record<string, unknown>) => {
    if (!dealId) return;
    
    setGeneralError(null);

    try {
      const response = await fetch(`/api/deals/${dealId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setGeneralError(result.message || t("common.error"));
        return;
      }

      router.push(`/deals/${dealId}`);
      router.refresh();
    } catch {
      setGeneralError(t("common.error"));
    }
  };

  // Format currency based on locale
  const fmt = (value: number) => formatCurrency(value, locale);

  // Check if down payment is valid
  const isDownPaymentValid = !useFinancing || (downPayment > 0 && downPayment <= purchasePrice);
  const minDownPayment = purchasePrice * 0.05;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  if (generalError && !dealId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/deals" aria-label={t("common.back")}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">{t("deal.title.edit")}</h1>
        </div>
        <div 
          role="alert"
          className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700"
        >
          {generalError}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/deals/${dealId}`} aria-label={t("common.back")}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("deal.title.edit")}</h1>
          <p className="text-muted-foreground">{t("deal.subtitle.edit")}</p>
        </div>
      </div>

      {generalError && (
        <div 
          role="alert"
          aria-live="assertive"
          className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700"
        >
          {generalError}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="space-y-6 lg:col-span-2"
          noValidate
        >
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t("deal.section.basicInfo")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                id="name"
                label={t("deal.name")}
                placeholder={t("deal.name.placeholder")}
                error={errors.name?.message}
                {...register("name")}
              />

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <Input
                    id="address"
                    label={t("deal.address")}
                    placeholder={t("deal.address.placeholder")}
                    error={errors.address?.message}
                    {...register("address")}
                  />
                </div>
                <ZipCodeInput
                  id="zipCode"
                  locale={locale}
                  value={watch("zipCode") || ""}
                  onChange={(value) => setValue("zipCode", value)}
                  error={errors.zipCode?.message}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="propertyType">{t("deal.propertyType")}</Label>
                <Select
                  value={watch("propertyType")}
                  onValueChange={(value) => setValue("propertyType", value as "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "INDUSTRIAL" | "MIXED")}
                >
                  <SelectTrigger id="propertyType">
                    <SelectValue placeholder={t("deal.propertyType.select")} />
                  </SelectTrigger>
                  <SelectContent>
                    {PROPERTY_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.propertyType && (
                  <p className="text-sm text-destructive">{errors.propertyType.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Property Characteristics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" aria-hidden="true" />
                {t("deal.section.characteristics")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1.5">
                  <Label htmlFor="area">{t("deal.area")} ({areaUnit})</Label>
                  <input
                    id="area"
                    type="number"
                    step="0.01"
                    min="0"
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder={t("deal.area.placeholder")}
                    {...register("area", { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="bedrooms">{t("deal.bedrooms")}</Label>
                  <input
                    id="bedrooms"
                    type="number"
                    min="0"
                    max="50"
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="3"
                    {...register("bedrooms", { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="bathrooms">{t("deal.bathrooms")}</Label>
                  <input
                    id="bathrooms"
                    type="number"
                    min="0"
                    max="50"
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="2"
                    {...register("bathrooms", { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="parkingSpaces">{t("deal.parkingSpaces")}</Label>
                  <input
                    id="parkingSpaces"
                    type="number"
                    min="0"
                    max="100"
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="2"
                    {...register("parkingSpaces", { valueAsNumber: true })}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="lotSize">{t("deal.lotSize")} ({areaUnit})</Label>
                  <input
                    id="lotSize"
                    type="number"
                    step="0.01"
                    min="0"
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="250"
                    {...register("lotSize", { valueAsNumber: true })}
                  />
                  <p className="text-xs text-muted-foreground">{t("deal.lotSize.description")}</p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="yearBuilt">{t("deal.yearBuilt")}</Label>
                  <input
                    id="yearBuilt"
                    type="number"
                    min="1800"
                    max={new Date().getFullYear() + 5}
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    placeholder="2010"
                    {...register("yearBuilt", { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="condition">{t("deal.condition")}</Label>
                  <Select
                    value={watch("condition") || ""}
                    onValueChange={(value) => setValue("condition", value as "NEW" | "EXCELLENT" | "GOOD" | "FAIR" | "NEEDS_WORK")}
                  >
                    <SelectTrigger id="condition">
                      <SelectValue placeholder={t("deal.condition.select")} />
                    </SelectTrigger>
                    <SelectContent>
                      {PROPERTY_CONDITIONS.map((cond) => (
                        <SelectItem key={cond.value} value={cond.value}>
                          {cond.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Details */}
          <Card>
            <CardHeader>
              <CardTitle>{t("deal.section.financial")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <CurrencyInput
                  id="purchasePrice"
                  label={t("deal.purchasePrice")}
                  locale={locale}
                  value={watch("purchasePrice")}
                  onValueChange={(value) => setValue("purchasePrice", value, { shouldValidate: true })}
                  error={errors.purchasePrice?.message}
                />

                <CurrencyInput
                  id="estimatedCosts"
                  label={t("deal.renovationCosts")}
                  locale={locale}
                  value={watch("estimatedCosts")}
                  onValueChange={(value) => setValue("estimatedCosts", value, { shouldValidate: true })}
                  error={errors.estimatedCosts?.message}
                  description={t("deal.renovationCosts.description")}
                />

                <CurrencyInput
                  id="monthlyExpenses"
                  label={t("deal.monthlyExpenses")}
                  locale={locale}
                  value={watch("monthlyExpenses")}
                  onValueChange={(value) => setValue("monthlyExpenses", value, { shouldValidate: true })}
                  error={errors.monthlyExpenses?.message}
                  description={t("deal.monthlyExpenses.description")}
                />

                <CurrencyInput
                  id="estimatedSalePrice"
                  label={t("deal.estimatedSalePrice")}
                  locale={locale}
                  value={watch("estimatedSalePrice")}
                  onValueChange={(value) => setValue("estimatedSalePrice", value, { shouldValidate: true })}
                  error={errors.estimatedSalePrice?.message}
                />

                <div className="space-y-1.5">
                  <Label htmlFor="estimatedTimeMonths">{t("deal.timeline")}</Label>
                  <input
                    id="estimatedTimeMonths"
                    type="number"
                    min="1"
                    max="60"
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="12"
                    {...register("estimatedTimeMonths", { valueAsNumber: true })}
                  />
                  {errors.estimatedTimeMonths && (
                    <p className="text-sm text-destructive">{errors.estimatedTimeMonths.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{t("deal.timeline.description")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financing Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" aria-hidden="true" />
                {t("deal.section.financing")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="useFinancing"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  {...register("useFinancing")}
                />
                <Label htmlFor="useFinancing" className="cursor-pointer">
                  {t("deal.financing.enabled")}
                </Label>
              </div>

              {useFinancing && (
                <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t">
                  <div className="space-y-1.5">
                    <CurrencyInput
                      id="downPayment"
                      label={t("deal.financing.downPayment")}
                      locale={locale}
                      value={watch("downPayment")}
                      onValueChange={(value) => setValue("downPayment", value, { shouldValidate: true })}
                      error={errors.downPayment?.message}
                    />
                    {purchasePrice > 0 && downPayment < minDownPayment && (
                      <p className="text-xs text-amber-600 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {locale === "pt-BR" 
                          ? `Mínimo recomendado: ${fmt(minDownPayment)} (5%)`
                          : `Minimum recommended: ${fmt(minDownPayment)} (5%)`
                        }
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label>{t("deal.financing.loanAmount")}</Label>
                    <div className="flex h-10 w-full items-center rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm">
                      {fmt(metrics.loanAmount)}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="interestRate">{t("deal.financing.interestRate")}</Label>
                    <div className="relative">
                      <input
                        id="interestRate"
                        type="number"
                        step="0.1"
                        min="0"
                        max="50"
                        className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 pr-8 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        {...register("interestRate", { valueAsNumber: true })}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{t("deal.financing.interestRate.description")}</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="loanTermYears">{t("deal.financing.loanTerm")}</Label>
                    <Select
                      value={String(watch("loanTermYears") || 30)}
                      onValueChange={(value) => setValue("loanTermYears", Number(value))}
                    >
                      <SelectTrigger id="loanTermYears">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {loanTermOptions.map((years) => (
                          <SelectItem key={years} value={String(years)}>
                            {years} {locale === "pt-BR" ? "anos" : "years"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <CurrencyInput
                    id="closingCosts"
                    label={t("deal.financing.closingCosts")}
                    locale={locale}
                    value={watch("closingCosts")}
                    onValueChange={(value) => setValue("closingCosts", value)}
                    description={t("deal.financing.closingCosts.description")}
                  />

                  <div className="space-y-1.5">
                    <Label>{t("deal.financing.monthlyPayment")}</Label>
                    <div className="flex h-10 w-full items-center rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm font-medium">
                      {fmt(metrics.monthlyPayment)}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
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

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => router.push(`/deals/${dealId}`)}>
              {t("common.cancel")}
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || (useFinancing && !isDownPaymentValid)} 
              aria-busy={isSubmitting}
            >
              {isSubmitting ? t("common.saving") : t("common.save")}
            </Button>
          </div>
        </form>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
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
                  {locale === "pt-BR" ? `Custos (${estimatedTimeMonths} meses)` : `Holding Costs (${estimatedTimeMonths}mo)`}
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
                
                <div className="flex justify-between font-medium pt-2 border-t">
                  <span>{t("preview.estimatedProfit")}</span>
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
