import type { PropertyType, PropertyCondition, DealFormValues } from "./types";

// Property types configuration
export const PROPERTY_TYPE_VALUES: PropertyType[] = [
  "RESIDENTIAL",
  "COMMERCIAL", 
  "LAND",
  "INDUSTRIAL",
  "MIXED",
];

// Property conditions configuration
export const PROPERTY_CONDITION_VALUES: (Exclude<PropertyCondition, null>)[] = [
  "NEW",
  "EXCELLENT",
  "GOOD",
  "FAIR",
  "NEEDS_WORK",
];

// Translation keys for property types
export const PROPERTY_TYPE_KEYS: Record<PropertyType, string> = {
  RESIDENTIAL: "deal.propertyType.residential",
  COMMERCIAL: "deal.propertyType.commercial",
  LAND: "deal.propertyType.land",
  INDUSTRIAL: "deal.propertyType.industrial",
  MIXED: "deal.propertyType.mixed",
};

// Translation keys for property conditions
export const PROPERTY_CONDITION_KEYS: Record<Exclude<PropertyCondition, null>, string> = {
  NEW: "deal.condition.new",
  EXCELLENT: "deal.condition.excellent",
  GOOD: "deal.condition.good",
  FAIR: "deal.condition.fair",
  NEEDS_WORK: "deal.condition.needsWork",
};

// Default form values
export const getDefaultFormValues = (defaultInterestRate: number): DealFormValues => ({
  name: "",
  address: "",
  zipCode: "",
  propertyType: "RESIDENTIAL",
  // Property characteristics
  area: null,
  bedrooms: null,
  bathrooms: null,
  parkingSpaces: null,
  lotSize: null,
  yearBuilt: null,
  condition: null,
  // Financial
  purchasePrice: 0,
  estimatedCosts: 0,
  monthlyExpenses: 0,
  estimatedSalePrice: 0,
  estimatedTimeMonths: 12,
  // Financing
  useFinancing: false,
  downPayment: 0,
  interestRate: defaultInterestRate,
  loanTermYears: 30,
  closingCosts: 0,
  // Notes
  notes: "",
});

// Input class for consistent styling
export const INPUT_CLASS = 
  "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

