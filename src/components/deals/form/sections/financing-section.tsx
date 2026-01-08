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

            {/* SAC vs PRICE Comparison - Clickable Cards */}
            {metrics.loanAmount > 0 && (
              <div className="sm:col-span-2 p-4 rounded-lg bg-muted/30 border space-y-3">
                <h4 className="font-medium flex items-center gap-2 text-sm">
                  <TrendingDown className="h-4 w-4 text-primary" />
                  {locale === "pt-BR" ? "Escolha o Sistema de Amortização" : "Choose Amortization System"}
                </h4>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* SAC Card - Clickable */}
                  <button
                    type="button"
                    onClick={() => setValue("amortizationType", "SAC")}
                    className={`p-3 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                      amortizationType === "SAC" 
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                        : "border-muted hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">SAC</span>
                      {amortizationType === "SAC" && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-blue-600 font-medium mb-2">
                      {locale === "pt-BR" ? "💰 Melhor para moradia" : "💰 Best for living"}
                    </p>
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
                        <span className="text-green-600 font-medium">{fmt(metrics.totalInterestSAC)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      {locale === "pt-BR" 
                        ? "Parcelas decrescentes, paga menos juros no total" 
                        : "Decreasing payments, less total interest"
                      }
                    </p>
                  </button>

                  {/* PRICE Card - Clickable */}
                  <button
                    type="button"
                    onClick={() => setValue("amortizationType", "PRICE")}
                    className={`p-3 rounded-lg border-2 text-left transition-all hover:shadow-md ${
                      amortizationType === "PRICE" 
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                        : "border-muted hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm">PRICE</span>
                      {amortizationType === "PRICE" && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-amber-600 font-medium mb-2">
                      {locale === "pt-BR" ? "📈 Melhor para investimento" : "📈 Best for investment"}
                    </p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{locale === "pt-BR" ? "Parcela Fixa" : "Fixed Payment"}</span>
                        <span className="font-medium text-amber-600">{fmt(metrics.monthlyPaymentPRICE)}</span>
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
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      {locale === "pt-BR" 
                        ? "Parcela menor e fixa, ideal para flip rápido" 
                        : "Lower fixed payment, ideal for quick flip"
                      }
                    </p>
                  </button>
                </div>

                {/* Comparison Info */}
                {amortizationType === "SAC" && metrics.interestSavings > 0 && (
                  <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                    <TrendingDown className="h-4 w-4" />
                    <span>
                      {locale === "pt-BR" 
                        ? `Economia de ${fmt(metrics.interestSavings)} em juros no total`
                        : `Saves ${fmt(metrics.interestSavings)} in total interest`
                      }
                    </span>
                  </div>
                )}
                {amortizationType === "PRICE" && (
                  <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm">
                    <Calculator className="h-4 w-4" />
                    <span>
                      {locale === "pt-BR" 
                        ? `Parcela ${fmt(metrics.firstPaymentSAC - metrics.monthlyPaymentPRICE)} menor que SAC inicial`
                        : `Payment ${fmt(metrics.firstPaymentSAC - metrics.monthlyPaymentPRICE)} lower than initial SAC`
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

