// Status configuration keys for translations
export const STATUS_KEYS: Record<string, { key: string; variant: "default" | "secondary" | "destructive" }> = {
  ANALYZING: { key: "status.analyzing", variant: "secondary" },
  ANALYSIS_COMPLETE: { key: "status.analysisComplete", variant: "default" },
  APPROVED: { key: "status.approved", variant: "default" },
  REJECTED: { key: "status.rejected", variant: "destructive" },
  PURCHASED: { key: "status.purchased", variant: "default" },
  RENOVATING: { key: "status.renovating", variant: "secondary" },
  FOR_SALE: { key: "status.forSale", variant: "default" },
  SOLD: { key: "status.sold", variant: "default" },
};

// Property type translation keys
export const PROPERTY_TYPE_KEYS: Record<string, string> = {
  RESIDENTIAL: "deal.propertyType.residential",
  COMMERCIAL: "deal.propertyType.commercial",
  LAND: "deal.propertyType.land",
  INDUSTRIAL: "deal.propertyType.industrial",
  MIXED: "deal.propertyType.mixed",
};

// Property condition translation keys
export const CONDITION_KEYS: Record<string, string> = {
  NEW: "deal.condition.new",
  EXCELLENT: "deal.condition.excellent",
  GOOD: "deal.condition.good",
  FAIR: "deal.condition.fair",
  NEEDS_WORK: "deal.condition.needsWork",
};

// Get status config with translated label
export function getStatusConfig(
  status: string, 
  t: (key: string) => string
): { label: string; variant: "default" | "secondary" | "destructive" } {
  const config = STATUS_KEYS[status] || STATUS_KEYS.ANALYZING;
  return {
    label: t(config.key),
    variant: config.variant,
  };
}

// Get property type label
export function getPropertyTypeLabel(propertyType: string, t: (key: string) => string): string {
  const key = PROPERTY_TYPE_KEYS[propertyType];
  return key ? t(key) : propertyType;
}

// Get condition label
export function getConditionLabel(condition: string, t: (key: string) => string): string {
  const key = CONDITION_KEYS[condition];
  return key ? t(key) : condition;
}

