"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Bed, Bath, Car, Ruler, Calendar, Building } from "lucide-react";
import { getConditionLabel } from "../constants";
import type { SectionProps } from "../types";

export function PropertyCharacteristics({ deal, locale, t }: SectionProps) {
  // Area unit based on locale
  const areaUnit = locale === "pt-BR" ? t("deal.area.unit") : t("deal.area.unitUS");

  // Check if any characteristic data exists
  const hasCharacteristics = deal.area || deal.bedrooms !== null || deal.bathrooms !== null || 
    deal.parkingSpaces !== null || deal.lotSize || deal.yearBuilt || deal.condition;

  if (!hasCharacteristics) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" aria-hidden="true" />
          {t("deal.section.characteristics")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {deal.area && (
            <CharacteristicItem
              icon={<Ruler className="h-5 w-5 text-primary" aria-hidden="true" />}
              label={t("deal.area")}
              value={`${deal.area} ${areaUnit}`}
            />
          )}
          
          {deal.bedrooms !== null && (
            <CharacteristicItem
              icon={<Bed className="h-5 w-5 text-primary" aria-hidden="true" />}
              label={t("deal.bedrooms")}
              value={String(deal.bedrooms)}
            />
          )}
          
          {deal.bathrooms !== null && (
            <CharacteristicItem
              icon={<Bath className="h-5 w-5 text-primary" aria-hidden="true" />}
              label={t("deal.bathrooms")}
              value={String(deal.bathrooms)}
            />
          )}
          
          {deal.parkingSpaces !== null && (
            <CharacteristicItem
              icon={<Car className="h-5 w-5 text-primary" aria-hidden="true" />}
              label={t("deal.parkingSpaces")}
              value={String(deal.parkingSpaces)}
            />
          )}
          
          {deal.lotSize && (
            <CharacteristicItem
              icon={<Ruler className="h-5 w-5 text-primary" aria-hidden="true" />}
              label={t("deal.lotSize")}
              value={`${deal.lotSize} ${areaUnit}`}
            />
          )}
          
          {deal.yearBuilt && (
            <CharacteristicItem
              icon={<Calendar className="h-5 w-5 text-primary" aria-hidden="true" />}
              label={t("deal.yearBuilt")}
              value={String(deal.yearBuilt)}
            />
          )}
          
          {deal.condition && (
            <CharacteristicItem
              icon={<Building className="h-5 w-5 text-primary" aria-hidden="true" />}
              label={t("deal.condition")}
              value={getConditionLabel(deal.condition, t)}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Sub-component for characteristic items
interface CharacteristicItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function CharacteristicItem({ icon, label, value }: CharacteristicItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
      {icon}
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

