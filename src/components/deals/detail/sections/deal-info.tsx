"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Calendar, 
  Calculator, 
  MapPin, 
  Gavel, 
  FileText,
  Home,
  AlertCircle
} from "lucide-react";
import { getPropertyTypeLabel } from "../constants";
import type { SectionProps } from "../types";

export function DealInfo({ deal, locale, t }: SectionProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));
  };

  const isAuction = deal.acquisitionType === "AUCTION";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("detail.dealInfo")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Address */}
        {deal.address && (
          <InfoItem
            icon={<MapPin className="h-5 w-5 text-muted-foreground" aria-hidden="true" />}
            label={t("deal.address")}
            value={deal.address}
          />
        )}
        
        {/* ZIP Code */}
        {deal.zipCode && (
          <InfoItem
            icon={<MapPin className="h-5 w-5 text-muted-foreground" aria-hidden="true" />}
            label={t("deal.zipCode")}
            value={deal.zipCode}
          />
        )}
        
        {/* Property Type */}
        <InfoItem
          icon={<Building className="h-5 w-5 text-muted-foreground" aria-hidden="true" />}
          label={t("detail.propertyType")}
          value={getPropertyTypeLabel(deal.propertyType, t)}
        />
        
        {/* Acquisition Type */}
        <div className="flex items-center gap-3 py-2 border-b">
          <Gavel className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{t("deal.acquisitionType.label")}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={isAuction ? "default" : "secondary"}>
                {isAuction ? t("deal.acquisitionType.auction") : t("deal.acquisitionType.traditional")}
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Registry Number */}
        {deal.registryNumber && (
          <InfoItem
            icon={<FileText className="h-5 w-5 text-muted-foreground" aria-hidden="true" />}
            label={locale === "pt-BR" ? "Matrícula" : "Registry Number"}
            value={deal.registryNumber}
          />
        )}
        
        {/* First Property Status */}
        <div className="flex items-center gap-3 py-2 border-b">
          <Home className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{t("deal.isFirstProperty")}</p>
            <div className="flex items-center gap-2 mt-1">
              {deal.isFirstProperty ? (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {locale === "pt-BR" ? "Sim - Isento de Imposto" : "Yes - Tax Exempt"}
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  {locale === "pt-BR" ? "Não - Sujeito a IR" : "No - Subject to Tax"}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        {/* Timeline */}
        <InfoItem
          icon={<Calendar className="h-5 w-5 text-muted-foreground" aria-hidden="true" />}
          label={t("detail.timeline")}
          value={`${deal.estimatedTimeMonths} ${t("detail.months")}`}
        />
        
        {/* Financing Details */}
        {deal.useFinancing && (
          <>
            <InfoItem
              icon={<Calculator className="h-5 w-5 text-primary" aria-hidden="true" />}
              label={t("deal.financing.interestRate")}
              value={`${deal.interestRate}% ${locale === "pt-BR" ? "a.a." : "APR"}`}
            />
            <InfoItem
              icon={<Calendar className="h-5 w-5 text-primary" aria-hidden="true" />}
              label={t("deal.financing.loanTerm")}
              value={`${deal.loanTermYears} ${locale === "pt-BR" ? "anos" : "years"}`}
            />
          </>
        )}
        
        {/* Created Date */}
        <InfoItem
          icon={<Calendar className="h-5 w-5 text-muted-foreground" aria-hidden="true" />}
          label={t("detail.created")}
          value={formatDate(deal.createdAt)}
        />
        
        {/* Updated Date */}
        <InfoItem
          icon={<Calendar className="h-5 w-5 text-muted-foreground" aria-hidden="true" />}
          label={t("detail.lastUpdated")}
          value={formatDate(deal.updatedAt)}
          isLast
        />
      </CardContent>
    </Card>
  );
}

// Sub-component for info items
interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLast?: boolean;
}

function InfoItem({ icon, label, value, isLast }: InfoItemProps) {
  return (
    <div className={`flex items-center gap-3 py-2 ${!isLast ? "border-b" : ""}`}>
      {icon}
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}
