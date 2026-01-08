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
import { Calculator, AlertTriangle, TrendingDown, ArrowDownRight } from "lucide-react";
import { INPUT_CLASS, AMORTIZATION_TYPE_VALUES, AMORTIZATION_TYPE_KEYS } from "../constants";
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
  const amortizationType = watch("amortizationType") || "SAC";

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

            {/* Amortization Type Selection */}
            <div className="space-y-1.5">
              <Label htmlFor="amortizationType">{t("deal.financing.amortization.label")}</Label>
              <Select
                value={amortizationType}
                onValueChange={(value) => setValue("amortizationType", value as "SAC" | "PRICE")}
              >
                <SelectTrigger id="amortizationType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AMORTIZATION_TYPE_VALUES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {t(AMORTIZATION_TYPE_KEYS[type])}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {amortizationType === "SAC" 
                  ? (locale === "pt-BR" ? "Parcelas decrescentes, menos juros" : "Decreasing payments, less interest")
                  : (locale === "pt-BR" ? "Parcelas fixas" : "Fixed payments")
                }
              </p>
            </div>

            <CurrencyInput
              id="closingCosts"
              label={t("deal.financing.closingCosts")}
              locale={locale}
              value={watch("closingCosts")}
              onValueChange={(value) => setValue("closingCosts", value)}
              description={t("deal.financing.closingCosts.description")}
            />

            {/* Monthly Payment Display */}
            <div className="space-y-1.5">
              <Label>{t("deal.financing.monthlyPayment")}</Label>
              <div className="flex h-10 w-full items-center rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm font-medium">
                {fmt(metrics.monthlyPayment)}
                {amortizationType === "SAC" && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({locale === "pt-BR" ? "média" : "avg"})
                  </span>
                )}
              </div>
            </div>

            {/* SAC vs PRICE Comparison */}
            {metrics.loanAmount > 0 && (
              <div className="sm:col-span-2 p-4 rounded-lg bg-muted/30 border space-y-3">
                <h4 className="font-medium flex items-center gap-2 text-sm">
                  <TrendingDown className="h-4 w-4 text-primary" />
                  {locale === "pt-BR" ? "Comparação SAC vs PRICE" : "SAC vs PRICE Comparison"}
                </h4>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* SAC Info */}
                  <div className={`p-3 rounded-lg border-2 ${amortizationType === "SAC" ? "border-primary bg-primary/5" : "border-muted"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">SAC</span>
                      {amortizationType === "SAC" && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                          {locale === "pt-BR" ? "Selecionado" : "Selected"}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{locale === "pt-BR" ? "1ª Parcela" : "First Payment"}</span>
                        <span className="font-medium">{fmt(metrics.firstPaymentSAC)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <ArrowDownRight className="h-3 w-3 text-green-600" />
                          {locale === "pt-BR" ? "Última" : "Last"}
                        </span>
                        <span className="font-medium text-green-600">{fmt(metrics.lastPaymentSAC)}</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t">
                        <span className="text-muted-foreground">{locale === "pt-BR" ? "Total Juros" : "Total Interest"}</span>
                        <span>{fmt(metrics.totalInterestSAC)}</span>
                      </div>
                    </div>
                  </div>

                  {/* PRICE Info */}
                  <div className={`p-3 rounded-lg border-2 ${amortizationType === "PRICE" ? "border-primary bg-primary/5" : "border-muted"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">PRICE</span>
                      {amortizationType === "PRICE" && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                          {locale === "pt-BR" ? "Selecionado" : "Selected"}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{locale === "pt-BR" ? "Parcela Fixa" : "Fixed Payment"}</span>
                        <span className="font-medium">{fmt(metrics.monthlyPaymentPRICE)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{locale === "pt-BR" ? "Todas iguais" : "All same"}</span>
                        <span className="text-muted-foreground">—</span>
                      </div>
                      <div className="flex justify-between pt-1 border-t">
                        <span className="text-muted-foreground">{locale === "pt-BR" ? "Total Juros" : "Total Interest"}</span>
                        <span>{fmt(metrics.totalInterestPRICE)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interest Savings */}
                {metrics.interestSavings > 0 && (
                  <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                    <TrendingDown className="h-4 w-4" />
                    <span>
                      {locale === "pt-BR" 
                        ? `SAC economiza ${fmt(metrics.interestSavings)} em juros no total`
                        : `SAC saves ${fmt(metrics.interestSavings)} in total interest`
                      }
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

