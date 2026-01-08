"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useDealForm } from "./use-deal-form";
import {
  BasicInfoSection,
  CharacteristicsSection,
  FinancialSection,
  FinancingSection,
  NotesSection,
  PreviewPanel,
  DocumentsSection,
} from "./sections";
import type { DealFormProps, UploadedFile } from "./types";

export function DealForm({ mode, dealId }: DealFormProps) {
  const router = useRouter();
  const [documents, setDocuments] = useState<UploadedFile[]>([]);
  
  const {
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
  } = useDealForm({ mode, dealId, documents });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const useFinancing = watch("useFinancing") || false;
  const acquisitionType = watch("acquisitionType") || "TRADITIONAL";
  const isAuction = acquisitionType === "AUCTION" || acquisitionType === "AUCTION_NO_FEE";

  // Loading state for edit mode
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  // Common form section props
  const sectionProps = {
    register,
    watch,
    setValue,
    errors,
    locale,
    t,
  };

  // Values for preview panel
  const previewValues = {
    purchasePrice: watch("purchasePrice") || 0,
    estimatedCosts: watch("estimatedCosts") || 0,
    monthlyExpenses: watch("monthlyExpenses") || 0,
    propertyDebts: watch("propertyDebts") || 0,
    estimatedTimeMonths: watch("estimatedTimeMonths") || 12,
    useFinancing,
    downPayment: watch("downPayment") || 0,
    closingCosts: watch("closingCosts") || 0,
    isFirstProperty: watch("isFirstProperty") ?? true,
    acquisitionType,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/deals" aria-label={t("common.back")}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {mode === "create" ? t("deal.title.new") : t("deal.title.edit")}
          </h1>
          <p className="text-muted-foreground">
            {mode === "create" ? t("deal.subtitle.new") : t("deal.subtitle.edit")}
          </p>
        </div>
      </div>

      {/* Error Alert */}
      {generalError && (
        <div 
          role="alert"
          aria-live="assertive"
          className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700"
        >
          {generalError}
        </div>
      )}

      {/* Form Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="space-y-6 lg:col-span-2"
          noValidate
        >
          <BasicInfoSection {...sectionProps} />
          
          <CharacteristicsSection {...sectionProps} areaUnit={areaUnit} />
          
          <FinancialSection {...sectionProps} />
          
          <DocumentsSection 
            documents={documents}
            onDocumentsChange={setDocuments}
            isAuction={isAuction}
            locale={locale}
            t={t}
          />
          
          <FinancingSection 
            {...sectionProps} 
            metrics={metrics}
            minDownPayment={minDownPayment}
            loanTermOptions={loanTermOptions}
          />
          
          <NotesSection register={register} t={t} />

          {/* Actions */}
          <div className="flex gap-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.push("/deals")}
            >
              {t("common.cancel")}
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || (useFinancing && !isDownPaymentValid)} 
              aria-busy={isSubmitting}
            >
              {isSubmitting 
                ? (mode === "create" ? t("common.creating") : t("common.saving"))
                : (mode === "create" ? t("deal.action.create") : t("deal.action.save"))
              }
            </Button>
          </div>
        </form>

        {/* Preview Panel */}
        <div className="lg:col-span-1">
          <PreviewPanel 
            metrics={metrics}
            values={previewValues}
            locale={locale}
            t={t}
          />
        </div>
      </div>
    </div>
  );
}

