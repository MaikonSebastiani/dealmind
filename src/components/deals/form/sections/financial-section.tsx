"use client";

import { CurrencyInput } from "@/components/ui/currency-input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INPUT_CLASS, ACQUISITION_TYPE_VALUES, ACQUISITION_TYPE_KEYS } from "../constants";
import type { FormSectionProps, AcquisitionType } from "../types";

export function FinancialSection({ 
  register, 
  watch, 
  setValue, 
  errors, 
  locale, 
  t 
}: FormSectionProps) {
  const acquisitionType = watch("acquisitionType");
  const isFirstProperty = watch("isFirstProperty");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("deal.section.financial")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Acquisition Type */}
        <div className="space-y-2">
          <Label htmlFor="acquisitionType">{t("deal.acquisitionType.label")}</Label>
          <Select
            value={acquisitionType || "TRADITIONAL"}
            onValueChange={(value) => setValue("acquisitionType", value as AcquisitionType)}
          >
            <SelectTrigger id="acquisitionType">
              <SelectValue placeholder={t("deal.acquisitionType.select")} />
            </SelectTrigger>
            <SelectContent>
              {ACQUISITION_TYPE_VALUES.map((type) => (
                <SelectItem key={type} value={type}>
                  {t(ACQUISITION_TYPE_KEYS[type])}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

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
          />

          <CurrencyInput
            id="monthlyExpenses"
            label={t("deal.monthlyExpenses")}
            locale={locale}
            value={watch("monthlyExpenses")}
            onValueChange={(value) => setValue("monthlyExpenses", value, { shouldValidate: true })}
            error={errors.monthlyExpenses?.message}
            description={t("deal.monthlyExpensesDescription")}
          />

          <CurrencyInput
            id="propertyDebts"
            label={t("deal.propertyDebts")}
            locale={locale}
            value={watch("propertyDebts")}
            onValueChange={(value) => setValue("propertyDebts", value, { shouldValidate: true })}
            error={errors.propertyDebts?.message}
            description={t("deal.propertyDebtsDescription")}
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
            <p className="text-xs text-muted-foreground">{t("deal.timelineDescription")}</p>
            {errors.estimatedTimeMonths && (
              <p className="text-sm text-destructive">{errors.estimatedTimeMonths.message}</p>
            )}
          </div>
        </div>

        {/* First Property Checkbox */}
        <div className="flex items-center space-x-2 pt-2 border-t">
          <Checkbox
            id="isFirstProperty"
            checked={isFirstProperty ?? true}
            onCheckedChange={(checked) => setValue("isFirstProperty", checked === true)}
          />
          <Label htmlFor="isFirstProperty" className="cursor-pointer text-sm">
            {t("deal.isFirstProperty")}
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
