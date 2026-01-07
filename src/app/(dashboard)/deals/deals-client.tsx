"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { Plus, ChevronRight } from "lucide-react";
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
  const router = useRouter();
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

  const handleRowClick = (dealId: string) => {
    router.push(`/deals/${dealId}`);
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
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deals.map((deal) => {
                const statusConfig = STATUS_CONFIG[deal.status] || STATUS_CONFIG.ANALYZING;
                return (
                  <TableRow 
                    key={deal.id}
                    onClick={() => handleRowClick(deal.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleRowClick(deal.id);
                      }
                    }}
                    tabIndex={0}
                    role="link"
                    aria-label={`${locale === "pt-BR" ? "Ver detalhes de" : "View details for"} ${deal.name}`}
                    className="cursor-pointer hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset transition-colors"
                  >
                    <TableCell className="font-medium">
                      <div>
                        <span className="text-foreground">{deal.name}</span>
                        {deal.address && (
                          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {deal.address}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {PROPERTY_TYPE_LABELS[deal.propertyType] || deal.propertyType}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig.variant}>
                        {statusConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {fmt(deal.purchasePrice)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`font-semibold ${(deal.estimatedROI ?? 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {formatPercent(deal.estimatedROI)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`font-semibold ${(deal.estimatedProfit ?? 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {fmt(deal.estimatedProfit)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
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
