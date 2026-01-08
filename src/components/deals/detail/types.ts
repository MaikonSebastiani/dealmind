import type { LocaleCode } from "@/contexts/locale-context";

// Document interface
export interface DealDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  mimeType: string;
  createdAt: Date;
}

// Deal interface for detail view
export interface Deal {
  id: string;
  name: string;
  address: string | null;
  zipCode: string | null;
  propertyType: string;
  status: string;
  // Property characteristics
  area: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
  lotSize: number | null;
  yearBuilt: number | null;
  condition: string | null;
  // Acquisition
  acquisitionType: string;
  registryNumber: string | null;
  // Financial
  purchasePrice: number;
  estimatedCosts: number;
  monthlyExpenses: number;
  propertyDebts: number | null;
  estimatedSalePrice: number;
  estimatedTimeMonths: number;
  isFirstProperty: boolean;
  useFinancing: boolean;
  amortizationType: string;
  downPayment: number | null;
  loanAmount: number | null;
  interestRate: number | null;
  loanTermYears: number | null;
  monthlyPayment: number | null;
  closingCosts: number | null;
  estimatedProfit: number | null;
  estimatedROI: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Documents
  documents?: DealDocument[];
}

// Metrics calculated from deal data
export interface DealMetrics {
  totalCashInvested: number;
  totalHoldingCosts: number;
  totalCostAtSale: number;
  grossProceeds: number;
  capitalGainsTax: number;
  estimatedProfit: number;
  estimatedROI: number;
  monthlyPayment: number;
  loanAmount: number;
}

// Props for DealDetail component
export interface DealDetailProps {
  deal: Deal;
}

// Props for section components
export interface SectionProps {
  deal: Deal;
  locale: LocaleCode;
  t: (key: string) => string;
}

// Props for sections that need metrics
export interface SectionWithMetricsProps extends SectionProps {
  metrics: DealMetrics;
}

// Status configuration
export interface StatusConfig {
  label: string;
  variant: "default" | "secondary" | "destructive";
}

// Format functions
export interface FormatFunctions {
  fmt: (value: number | null) => string;
  formatPercent: (value: number | null) => string;
  formatDate: (date: Date) => string;
}

