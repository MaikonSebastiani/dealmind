"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ZipCodeInput } from "@/components/ui/zipcode-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PROPERTY_TYPE_VALUES, PROPERTY_TYPE_KEYS } from "../constants";
import type { FormSectionProps, PropertyType } from "../types";

export function BasicInfoSection({ 
  register, 
  watch, 
  setValue, 
  errors, 
  locale, 
  t 
}: FormSectionProps) {
  const propertyTypes = PROPERTY_TYPE_VALUES.map((value) => ({
    value,
    label: t(PROPERTY_TYPE_KEYS[value]),
  }));

  return (
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
            onValueChange={(value) => setValue("propertyType", value as PropertyType)}
          >
            <SelectTrigger id="propertyType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

