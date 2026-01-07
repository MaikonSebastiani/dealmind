import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from "react-hook-form";
import type { LocaleCode } from "@/contexts/locale-context";

// Property type values
export type PropertyType = "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "INDUSTRIAL" | "MIXED";

// Property condition values
export type PropertyCondition = "NEW" | "EXCELLENT" | "GOOD" | "FAIR" | "NEEDS_WORK" | null;

// Form values interface
export interface DealFormValues {
  name: string;
  address: string;
  zipCode: string;
  propertyType: PropertyType;
  // Property characteristics
  area: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
  lotSize: number | null;
  yearBuilt: number | null;
  condition: PropertyCondition;
  // Financial
  purchasePrice: number;
  estimatedCosts: number;
  monthlyExpenses: number;
  estimatedSalePrice: number;
  estimatedTimeMonths: number;
  // Financing
  useFinancing: boolean;
  downPayment: number;
  interestRate: number;
  loanTermYears: number;
  closingCosts: number;
  // Notes
  notes: string;
}

// Deal metrics from calculations
export interface DealMetrics {
  loanAmount: number;
  monthlyPayment: number;
  totalCashInvested: number;
  totalHoldingCosts: number;
  grossProceeds: number;
  estimatedProfit: number;
  estimatedROI: number;
}

// Form mode
export type DealFormMode = "create" | "edit";

// Props for DealForm component
export interface DealFormProps {
  mode: DealFormMode;
  dealId?: Promise<{ id: string }>;
}

// Props for form sections
export interface FormSectionProps {
  register: UseFormRegister<DealFormValues>;
  watch: UseFormWatch<DealFormValues>;
  setValue: UseFormSetValue<DealFormValues>;
  errors: FieldErrors<DealFormValues>;
  locale: LocaleCode;
  t: (key: string) => string;
}

// Props for preview panel
export interface PreviewPanelProps {
  metrics: DealMetrics;
  values: {
    purchasePrice: number;
    estimatedCosts: number;
    monthlyExpenses: number;
    estimatedTimeMonths: number;
    useFinancing: boolean;
    downPayment: number;
    closingCosts: number;
  };
  locale: LocaleCode;
  t: (key: string) => string;
}

// Props for financing section
export interface FinancingSectionProps extends FormSectionProps {
  metrics: DealMetrics;
  minDownPayment: number;
  loanTermOptions: number[];
}

// API response types
export interface DealResponse {
  deal: {
    id: string;
    name: string;
    address: string | null;
    zipCode: string | null;
    propertyType: PropertyType;
    area: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    parkingSpaces: number | null;
    lotSize: number | null;
    yearBuilt: number | null;
    condition: PropertyCondition;
    purchasePrice: number;
    estimatedCosts: number;
    monthlyExpenses: number;
    estimatedSalePrice: number;
    estimatedTimeMonths: number;
    useFinancing: boolean;
    downPayment: number | null;
    interestRate: number | null;
    loanTermYears: number | null;
    closingCosts: number | null;
    notes: string | null;
  };
}

