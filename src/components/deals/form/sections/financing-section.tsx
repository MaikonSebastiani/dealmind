"use client";

import { CurrencyInput } from "@/components/ui/currency-input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, AlertTriangle } from "lucide-react";
import { INPUT_CLASS } from "../constants";
import type { FinancingSectionProps } from "../types";
import { formatCurrency } from "@/lib/i18n/currency";

export function FinancingSection({ 
  register, 
  watch, 
  setValue, 
  errors, 
  locale, 
  t,
  metrics,
  minDownPayment,
  loanTermOptions,
}: FinancingSectionProps) {
  const useFinancing = watch("useFinancing");
  const downPayment = watch("downPayment") || 0;
  const purchasePrice = watch("purchasePrice") || 0;

  const fmt = (value: number) => formatCurrency(value, locale);

  return (
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
                  className={`${INPUT_CLASS} pr-8`}
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
  );
}

