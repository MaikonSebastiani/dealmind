import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from "react-hook-form";
import type { LocaleCode } from "@/contexts/locale-context";

// Property type values
export type PropertyType = "RESIDENTIAL" | "COMMERCIAL" | "LAND" | "INDUSTRIAL" | "MIXED";

// Property condition values
export type PropertyCondition = "NEW" | "EXCELLENT" | "GOOD" | "FAIR" | "NEEDS_WORK" | null;

// Acquisition type values
export type AcquisitionType = "TRADITIONAL" | "AUCTION" | "AUCTION_NO_FEE";

// Document type values
export type DocumentType = "PROPERTY_REGISTRY" | "AUCTION_NOTICE" | "CONTRACT" | "INSPECTION" | "OTHER";

// Uploaded file interface
export interface UploadedFile {
  id?: string;
  name: string;
  url: string;
  key: string;
  size: number;
  type: DocumentType;
}

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
  // Acquisition
  acquisitionType: AcquisitionType;
  registryNumber?: string;
  // Financial
  purchasePrice: number;
  estimatedCosts: number;
  monthlyExpenses: number;
  propertyDebts: number;
  estimatedSalePrice: number;
  estimatedTimeMonths: number;
  isFirstProperty: boolean;
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
  auctioneerFee: number;       // Comissão do leiloeiro (5%)
  totalCashInvested: number;
  totalHoldingCosts: number;
  grossProceeds: number;
  capitalGainsTax: number;
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
    propertyDebts: number;
    estimatedTimeMonths: number;
    useFinancing: boolean;
    downPayment: number;
    closingCosts: number;
    isFirstProperty: boolean;
    acquisitionType: AcquisitionType;
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
    // Acquisition
    acquisitionType: AcquisitionType;
    registryNumber: string | null;
    // Financial
    purchasePrice: number;
    estimatedCosts: number;
    monthlyExpenses: number;
    propertyDebts: number;
    estimatedSalePrice: number;
    estimatedTimeMonths: number;
    isFirstProperty: boolean;
    useFinancing: boolean;
    downPayment: number | null;
    interestRate: number | null;
    loanTermYears: number | null;
    closingCosts: number | null;
    notes: string | null;
    // Documents
    documents?: Array<{
      id: string;
      name: string;
      url: string;
      fileKey: string;
      size: number;
      type: DocumentType;
    }>;
  };
}

