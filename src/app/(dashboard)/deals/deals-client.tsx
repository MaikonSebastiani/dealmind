"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Pencil } from "lucide-react";
import { useLocale } from "@/contexts/locale-context";
import { formatCurrency } from "@/lib/i18n/currency";

interface Deal {
  id: string;
  name: string;
  address: string | null;
  propertyType: string;
  status: string;
  purchasePrice: number;
  estimatedProfit: number | null;
  estimatedROI: number | null;
}

interface DealsPageClientProps {
  deals: Deal[];
}

export function DealsPageClient({ deals }: DealsPageClientProps) {
  const { t, locale } = useLocale();

  const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
    ANALYZING: { label: t("status.analyzing"), variant: "secondary" },
    APPROVED: { label: t("status.approved"), variant: "default" },
    REJECTED: { label: t("status.rejected"), variant: "destructive" },
    PURCHASED: { label: t("status.purchased"), variant: "default" },
    RENOVATING: { label: t("status.renovating"), variant: "secondary" },
    FOR_SALE: { label: t("status.forSale"), variant: "default" },
    SOLD: { label: t("status.sold"), variant: "default" },
  };

  const PROPERTY_TYPE_LABELS: Record<string, string> = {
    RESIDENTIAL: t("deal.propertyType.residential"),
    COMMERCIAL: t("deal.propertyType.commercial"),
    LAND: t("deal.propertyType.land"),
    INDUSTRIAL: t("deal.propertyType.industrial"),
    MIXED: t("deal.propertyType.mixed"),
  };

  const fmt = (value: number | null) => {
    if (value === null) return "-";
    return formatCurrency(value, locale);
  };

  const formatPercent = (value: number | null) => {
    if (value === null) return "-";
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("deals.title")}</h1>
          <p className="text-muted-foreground">
            {locale === "pt-BR" 
              ? "Gerencie seus negócios de investimento imobiliário"
              : "Manage your real estate investment deals"
            }
          </p>
        </div>
        <Button asChild>
          <Link href="/deals/new">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            {t("deals.newDeal")}
          </Link>
        </Button>
      </div>

      {deals.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <div className="rounded-full bg-muted p-4">
            <Plus className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">
            {locale === "pt-BR" ? "Nenhum negócio ainda" : "No deals yet"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            {t("deals.empty")}
          </p>
          <Button asChild className="mt-4">
            <Link href="/deals/new">
              {locale === "pt-BR" ? "Criar seu primeiro negócio" : "Create your first deal"}
            </Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("deals.table.name")}</TableHead>
                <TableHead>{t("deals.table.type")}</TableHead>
                <TableHead>{t("deals.table.status")}</TableHead>
                <TableHead className="text-right">{t("deals.table.investment")}</TableHead>
                <TableHead className="text-right">{t("deals.table.roi")}</TableHead>
                <TableHead className="text-right">{t("deals.table.profit")}</TableHead>
                <TableHead className="sr-only">{t("deals.table.actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.map((deal) => {
                const statusConfig = STATUS_CONFIG[deal.status] || STATUS_CONFIG.ANALYZING;
                return (
                  <TableRow key={deal.id}>
                    <TableCell className="font-medium">
                      <Link 
                        href={`/deals/${deal.id}`}
                        className="hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 rounded"
                      >
                        {deal.name}
                      </Link>
                      {deal.address && (
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {deal.address}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      {PROPERTY_TYPE_LABELS[deal.propertyType] || deal.propertyType}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig.variant}>
                        {statusConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {fmt(deal.purchasePrice)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={(deal.estimatedROI ?? 0) >= 0 ? "text-green-600" : "text-red-600"}>
                        {formatPercent(deal.estimatedROI)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={(deal.estimatedProfit ?? 0) >= 0 ? "text-green-600" : "text-red-600"}>
                        {fmt(deal.estimatedProfit)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" asChild>
                          <Link 
                            href={`/deals/${deal.id}`}
                            aria-label={`${t("common.edit")} ${deal.name}`}
                          >
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon" asChild>
                          <Link 
                            href={`/deals/${deal.id}/edit`}
                            aria-label={`${t("common.edit")} ${deal.name}`}
                          >
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

