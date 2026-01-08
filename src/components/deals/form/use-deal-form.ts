"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDealSchema } from "@/lib/validations/deal";
import { useLocale } from "@/contexts/locale-context";
import { 
  calculateDealMetrics, 
  getDefaultInterestRate, 
  getLoanTermOptions 
} from "@/lib/calculations/financing";
import { getDefaultFormValues } from "./constants";
import type { DealFormMode, DealFormValues, DealMetrics, DealResponse, UploadedFile } from "./types";

interface UseDealFormOptions {
  mode: DealFormMode;
  dealId?: Promise<{ id: string }>;
  documents?: UploadedFile[];
}

interface UseDealFormReturn {
  // Form state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<DealFormValues, any, DealFormValues>;
  isLoading: boolean;
  generalError: string | null;
  
  // Locale
  locale: ReturnType<typeof useLocale>["locale"];
  t: ReturnType<typeof useLocale>["t"];
  areaUnit: string;
  
  // Calculated values
  metrics: DealMetrics;
  minDownPayment: number;
  isDownPaymentValid: boolean;
  loanTermOptions: number[];
  
  // Actions
  onSubmit: (data: DealFormValues) => Promise<void>;
  formatCurrencyValue: (value: number) => string;
}

export function useDealForm({ mode, dealId, documents = [] }: UseDealFormOptions): UseDealFormReturn {
  const router = useRouter();
  const { t, locale } = useLocale();
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [resolvedDealId, setResolvedDealId] = useState<string | null>(null);

  // Locale-specific defaults
  const defaultInterestRate = getDefaultInterestRate(locale);
  const loanTermOptions = getLoanTermOptions(locale);
  const areaUnit = locale === "pt-BR" ? t("deal.area.unit") : t("deal.area.unitUS");

  // Initialize form with any resolver to avoid type conflicts between Zod and React Hook Form
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const form = useForm<DealFormValues>({
    resolver: zodResolver(createDealSchema) as any,
    defaultValues: getDefaultFormValues(defaultInterestRate) as DealFormValues,
  });

  const { watch, reset } = form;

  // Watch values for calculations
  const watchedValues = {
    purchasePrice: watch("purchasePrice") || 0,
    estimatedCosts: watch("estimatedCosts") || 0,
    monthlyExpenses: watch("monthlyExpenses") || 0,
    propertyDebts: watch("propertyDebts") || 0,
    estimatedSalePrice: watch("estimatedSalePrice") || 0,
    estimatedTimeMonths: watch("estimatedTimeMonths") || 12,
    acquisitionType: watch("acquisitionType") || "TRADITIONAL",
    useFinancing: watch("useFinancing") || false,
    amortizationType: watch("amortizationType") || "SAC",
    downPayment: watch("downPayment") || 0,
    interestRate: watch("interestRate") || defaultInterestRate,
    loanTermYears: watch("loanTermYears") || 30,
    closingCosts: watch("closingCosts") || 0,
    isFirstProperty: watch("isFirstProperty") ?? false,
    locale,
  };

  // Calculate metrics
  const metrics = calculateDealMetrics(watchedValues);

  // Down payment validation
  const minDownPayment = watchedValues.purchasePrice * 0.05;
  const isDownPaymentValid = !watchedValues.useFinancing || 
    (watchedValues.downPayment > 0 && watchedValues.downPayment <= watchedValues.purchasePrice);

  // Load deal data for edit mode
  useEffect(() => {
    if (mode !== "edit" || !dealId) return;

    async function loadDeal() {
      const { id } = await dealId!;
      setResolvedDealId(id);

      try {
        const response = await fetch(`/api/deals/${id}`);
        
        if (!response.ok) {
          setGeneralError(t("deal.notFound"));
          setIsLoading(false);
          return;
        }

        const data: DealResponse = await response.json();
        const deal = data.deal;
        
        reset({
          name: deal.name,
          address: deal.address || "",
          zipCode: deal.zipCode || "",
          propertyType: deal.propertyType,
          area: deal.area,
          bedrooms: deal.bedrooms,
          bathrooms: deal.bathrooms,
          parkingSpaces: deal.parkingSpaces,
          lotSize: deal.lotSize,
          yearBuilt: deal.yearBuilt,
          condition: deal.condition,
          // Acquisition data
          acquisitionType: deal.acquisitionType || "TRADITIONAL",
          registryNumber: deal.registryNumber || undefined,
          // Financial
          purchasePrice: Number(deal.purchasePrice),
          estimatedCosts: Number(deal.estimatedCosts),
          monthlyExpenses: Number(deal.monthlyExpenses),
          propertyDebts: Number(deal.propertyDebts || 0),
          estimatedSalePrice: Number(deal.estimatedSalePrice),
          estimatedTimeMonths: deal.estimatedTimeMonths,
          isFirstProperty: deal.isFirstProperty ?? true,
          useFinancing: deal.useFinancing,
          amortizationType: deal.amortizationType || "SAC",
          downPayment: deal.downPayment ? Number(deal.downPayment) : 0,
          interestRate: deal.interestRate ? Number(deal.interestRate) : defaultInterestRate,
          loanTermYears: deal.loanTermYears || 30,
          closingCosts: deal.closingCosts ? Number(deal.closingCosts) : 0,
          notes: deal.notes || "",
        });

        setIsLoading(false);
      } catch {
        setGeneralError(t("common.error"));
        setIsLoading(false);
      }
    }

    loadDeal();
  }, [mode, dealId, reset, t, defaultInterestRate]);

  // Submit handler
  const onSubmit = async (data: DealFormValues) => {
    setGeneralError(null);

    try {
      const url = mode === "create" ? "/api/deals" : `/api/deals/${resolvedDealId}`;
      const method = mode === "create" ? "POST" : "PATCH";

      // Prepare request body with documents
      const requestBody = {
        ...data,
        documents: documents.map(doc => ({
          name: doc.name,
          url: doc.url,
          fileKey: doc.key,
          size: doc.size,
          type: doc.type,
        })),
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (!response.ok) {
        setGeneralError(result.message || t("common.error"));
        return;
      }

      router.push("/deals");
      router.refresh();
    } catch {
      setGeneralError(t("common.error"));
    }
  };

  // Format currency helper
  const { formatCurrency } = require("@/lib/i18n/currency");
  const formatCurrencyValue = (value: number) => formatCurrency(value, locale);

  return {
    form,
    isLoading,
    generalError,
    locale,
    t,
    areaUnit,
    metrics,
    minDownPayment,
    isDownPaymentValid,
    loanTermOptions,
    onSubmit,
    formatCurrencyValue,
  };
}

