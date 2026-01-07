"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "@/contexts/locale-context";

const STATUS_OPTIONS = [
  { value: "all", labelKey: "filter.status.all" },
  { value: "ANALYZING", labelKey: "status.analyzing" },
  { value: "APPROVED", labelKey: "status.approved" },
  { value: "REJECTED", labelKey: "status.rejected" },
  { value: "PURCHASED", labelKey: "status.purchased" },
  { value: "RENOVATING", labelKey: "status.renovating" },
  { value: "FOR_SALE", labelKey: "status.forSale" },
  { value: "SOLD", labelKey: "status.sold" },
];

const PROPERTY_TYPE_OPTIONS = [
  { value: "all", labelKey: "filter.type.all" },
  { value: "RESIDENTIAL", labelKey: "deal.propertyType.residential" },
  { value: "COMMERCIAL", labelKey: "deal.propertyType.commercial" },
  { value: "LAND", labelKey: "deal.propertyType.land" },
  { value: "INDUSTRIAL", labelKey: "deal.propertyType.industrial" },
  { value: "MIXED", labelKey: "deal.propertyType.mixed" },
];

const SORT_OPTIONS = [
  { value: "createdAt-desc", labelKey: "filter.sort.newest" },
  { value: "createdAt-asc", labelKey: "filter.sort.oldest" },
  { value: "purchasePrice-desc", labelKey: "filter.sort.priceHigh" },
  { value: "purchasePrice-asc", labelKey: "filter.sort.priceLow" },
  { value: "estimatedROI-desc", labelKey: "filter.sort.roiHigh" },
  { value: "estimatedROI-asc", labelKey: "filter.sort.roiLow" },
  { value: "name-asc", labelKey: "filter.sort.nameAZ" },
  { value: "name-desc", labelKey: "filter.sort.nameZA" },
];

export function DealsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const [isPending, startTransition] = useTransition();

  // Get current filter values from URL
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";
  const propertyType = searchParams.get("type") || "all";
  const sort = searchParams.get("sort") || "createdAt-desc";

  // Check if any filters are active
  const hasActiveFilters = search || status !== "all" || propertyType !== "all" || sort !== "createdAt-desc";

  // Update URL with new params
  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === "all" || (key === "sort" && value === "createdAt-desc")) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  // Clear all filters
  const clearFilters = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={t("filter.search.placeholder")}
            value={search}
            onChange={(e) => updateParams({ search: e.target.value })}
            className="flex h-10 w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          {search && (
            <button
              onClick={() => updateParams({ search: null })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={t("filter.clearSearch")}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <Select value={status} onValueChange={(value) => updateParams({ status: value })}>
            <SelectTrigger className="w-[140px]" aria-label={t("filter.status")}>
              <SelectValue placeholder={t("filter.status")} />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {t(option.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Property Type Filter */}
          <Select value={propertyType} onValueChange={(value) => updateParams({ type: value })}>
            <SelectTrigger className="w-[140px]" aria-label={t("filter.type")}>
              <SelectValue placeholder={t("filter.type")} />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {t(option.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sort} onValueChange={(value) => updateParams({ sort: value })}>
            <SelectTrigger className="w-[160px]" aria-label={t("filter.sort")}>
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              <SelectValue placeholder={t("filter.sort")} />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {t(option.labelKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-muted-foreground"
            >
              <X className="mr-1 h-4 w-4" />
              {t("filter.clear")}
            </Button>
          )}
        </div>
      </div>

      {/* Loading indicator */}
      {isPending && (
        <div className="text-sm text-muted-foreground animate-pulse">
          {t("common.loading")}
        </div>
      )}
    </div>
  );
}

