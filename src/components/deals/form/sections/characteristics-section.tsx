"use client";

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
import { INPUT_CLASS, PROPERTY_CONDITION_VALUES, PROPERTY_CONDITION_KEYS } from "../constants";
import type { FormSectionProps, PropertyCondition } from "../types";

interface CharacteristicsSectionProps extends FormSectionProps {
  areaUnit: string;
}

export function CharacteristicsSection({ 
  register, 
  watch,
  setValue, 
  errors, 
  t,
  areaUnit,
}: CharacteristicsSectionProps) {
  const propertyConditions = PROPERTY_CONDITION_VALUES.map((value) => ({
    value,
    label: t(PROPERTY_CONDITION_KEYS[value]),
  }));

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
              className={INPUT_CLASS}
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
              className={INPUT_CLASS}
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
              className={INPUT_CLASS}
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
              className={INPUT_CLASS}
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
              className={INPUT_CLASS}
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
              className={INPUT_CLASS}
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
              onValueChange={(value) => setValue("condition", value as PropertyCondition)}
            >
              <SelectTrigger id="condition">
                <SelectValue placeholder={t("deal.condition.select")} />
              </SelectTrigger>
              <SelectContent>
                {propertyConditions.map((cond) => (
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

