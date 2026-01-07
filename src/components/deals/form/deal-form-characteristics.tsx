"use client";

import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";
import { useLocale, type LocaleCode } from "@/contexts/locale-context";

type ConditionType = "NEW" | "EXCELLENT" | "GOOD" | "FAIR" | "NEEDS_WORK" | null;

interface FormValues {
  area?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  parkingSpaces?: number | null;
  lotSize?: number | null;
  yearBuilt?: number | null;
  condition?: ConditionType;
  [key: string]: unknown;
}

interface DealFormCharacteristicsProps {
  register: UseFormRegister<FormValues>;
  watch: UseFormWatch<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  errors: FieldErrors<FormValues>;
  locale: LocaleCode;
}

export function DealFormCharacteristics({ 
  register, 
  watch,
  setValue, 
  errors,
  locale,
}: DealFormCharacteristicsProps) {
  const { t } = useLocale();

  const PROPERTY_CONDITIONS = [
    { value: "NEW", label: t("deal.condition.new") },
    { value: "EXCELLENT", label: t("deal.condition.excellent") },
    { value: "GOOD", label: t("deal.condition.good") },
    { value: "FAIR", label: t("deal.condition.fair") },
    { value: "NEEDS_WORK", label: t("deal.condition.needsWork") },
  ];

  const areaUnit = locale === "pt-BR" ? "m²" : "sqft";

  return (
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
            {errors.area && (
              <p className="text-sm text-destructive">{errors.area.message}</p>
            )}
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
            {errors.bedrooms && (
              <p className="text-sm text-destructive">{errors.bedrooms.message}</p>
            )}
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
            {errors.bathrooms && (
              <p className="text-sm text-destructive">{errors.bathrooms.message}</p>
            )}
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
            {errors.parkingSpaces && (
              <p className="text-sm text-destructive">{errors.parkingSpaces.message}</p>
            )}
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
            {errors.lotSize && (
              <p className="text-sm text-destructive">{errors.lotSize.message}</p>
            )}
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
            {errors.yearBuilt && (
              <p className="text-sm text-destructive">{errors.yearBuilt.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="condition">{t("deal.condition")}</Label>
            <Select
              value={watch("condition") || ""}
              onValueChange={(value) => setValue("condition", value as ConditionType)}
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
            {errors.condition && (
              <p className="text-sm text-destructive">{errors.condition.message}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

