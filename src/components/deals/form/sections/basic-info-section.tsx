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
import type { AddressData } from "@/lib/services/viacep";

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

  // Track if address was filled by CEP lookup (for pt-BR)
  const isBrazilian = locale === "pt-BR";
  const currentAddress = watch("address");
  const currentZipCode = watch("zipCode");
  
  // Address is locked until CEP lookup fills it (only for pt-BR)
  const isAddressLocked = isBrazilian && (!currentAddress || currentAddress.trim() === "");

  // Handle address auto-fill from CEP lookup
  const handleAddressFound = (address: AddressData) => {
    setValue("address", address.fullAddress, { shouldValidate: true });
  };

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
          <ZipCodeInput
            id="zipCode"
            locale={locale}
            value={watch("zipCode") || ""}
            onChange={(value) => setValue("zipCode", value)}
            onAddressFound={handleAddressFound}
            error={errors.zipCode?.message}
          />
          <div className="sm:col-span-2">
            <Input
              id="address"
              label={t("deal.address")}
              placeholder={isAddressLocked ? t("deal.address.waitingCep") : t("deal.address.placeholder")}
              error={errors.address?.message}
              disabled={isAddressLocked}
              description={isAddressLocked ? t("deal.address.cepHint") : undefined}
              {...register("address")}
            />
          </div>
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

