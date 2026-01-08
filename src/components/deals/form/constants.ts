import type { PropertyType, PropertyCondition, AcquisitionType, AmortizationType, DealFormValues } from "./types";

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

// Acquisition types configuration
export const ACQUISITION_TYPE_VALUES: AcquisitionType[] = [
  "TRADITIONAL",
  "AUCTION",
  "AUCTION_NO_FEE",
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

// Translation keys for acquisition types
export const ACQUISITION_TYPE_KEYS: Record<AcquisitionType, string> = {
  TRADITIONAL: "deal.acquisitionType.traditional",
  AUCTION: "deal.acquisitionType.auction",
  AUCTION_NO_FEE: "deal.acquisitionType.auctionNoFee",
};

// Amortization types configuration
export const AMORTIZATION_TYPE_VALUES: AmortizationType[] = [
  "PRICE",
  "SAC",
];

// Translation keys for amortization types
export const AMORTIZATION_TYPE_KEYS: Record<AmortizationType, string> = {
  PRICE: "deal.financing.amortization.price",
  SAC: "deal.financing.amortization.sac",
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
  // Acquisition
  acquisitionType: "TRADITIONAL",
  registryNumber: undefined,
  // Financial
  purchasePrice: 0,
  estimatedCosts: 0,
  monthlyExpenses: 0,
  propertyDebts: 0,
  estimatedSalePrice: 0,
  estimatedTimeMonths: 12,
  isFirstProperty: false,
  // Financing
  useFinancing: false,
  amortizationType: "SAC",
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

