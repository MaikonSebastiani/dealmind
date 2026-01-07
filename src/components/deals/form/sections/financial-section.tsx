"use client";

import { CurrencyInput } from "@/components/ui/currency-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { INPUT_CLASS } from "../constants";
import type { FormSectionProps } from "../types";

export function FinancialSection({ 
  register, 
  watch, 
  setValue, 
  errors, 
  locale, 
  t 
}: FormSectionProps) {
  return (
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
              className={INPUT_CLASS}
              placeholder="12"
              {...register("estimatedTimeMonths", { valueAsNumber: true })}
            />
            <p className="text-xs text-muted-foreground">{t("deal.timeline.description")}</p>
            {errors.estimatedTimeMonths && (
              <p className="text-sm text-destructive">{errors.estimatedTimeMonths.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

