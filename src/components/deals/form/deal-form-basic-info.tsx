"use client";

import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from "react-hook-form";
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
import { useLocale, type LocaleCode } from "@/contexts/locale-context";

interface FormValues {
  name: string;
  address?: string;
  zipCode?: string;
  propertyType: "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "INDUSTRIAL" | "MIXED";
  [key: string]: unknown;
}

interface DealFormBasicInfoProps {
  register: UseFormRegister<FormValues>;
  watch: UseFormWatch<FormValues>;
  setValue: UseFormSetValue<FormValues>;
  errors: FieldErrors<FormValues>;
  locale: LocaleCode;
}

export function DealFormBasicInfo({ 
  register, 
  watch, 
  setValue, 
  errors,
  locale,
}: DealFormBasicInfoProps) {
  const { t } = useLocale();

  const PROPERTY_TYPES = [
    { value: "RESIDENTIAL", label: t("deal.propertyType.residential") },
    { value: "COMMERCIAL", label: t("deal.propertyType.commercial") },
    { value: "LAND", label: t("deal.propertyType.land") },
    { value: "INDUSTRIAL", label: t("deal.propertyType.industrial") },
    { value: "MIXED", label: t("deal.propertyType.mixed") },
  ];

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
            onValueChange={(value) => setValue("propertyType", value as FormValues["propertyType"])}
          >
            <SelectTrigger id="propertyType">
              <SelectValue placeholder={t("deal.propertyType.select")} />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.propertyType && (
            <p className="text-sm text-destructive">{errors.propertyType.message}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

