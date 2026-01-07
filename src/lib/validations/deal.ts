import { z } from "zod";

// Base schema without refinements
const baseDealSchema = z.object({
  name: z
    .string()
    .min(1, "Deal name is required")
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters"),
  address: z
    .string()
    .max(200, "Address must be less than 200 characters")
    .optional()
    .or(z.literal("")),
  zipCode: z
    .string()
    .max(20, "ZIP code must be less than 20 characters")
    .optional()
    .or(z.literal("")),
  propertyType: z.enum([
    "RESIDENTIAL",
    "COMMERCIAL", 
    "LAND",
    "INDUSTRIAL",
    "MIXED",
  ]),
  purchasePrice: z
    .number()
    .positive("Purchase price must be positive")
    .max(999999999999, "Price is too high"),
  estimatedCosts: z
    .number()
    .min(0, "Costs cannot be negative"),
  monthlyExpenses: z
    .number()
    .min(0, "Monthly expenses cannot be negative")
    .max(9999999, "Monthly expenses is too high"),
  estimatedSalePrice: z
    .number()
    .positive("Sale price must be positive")
    .max(999999999999, "Price is too high"),
  estimatedTimeMonths: z
    .number()
    .int()
    .min(1, "Time must be at least 1 month")
    .max(60, "Time must be less than 5 years"), // Reduced for flipping focus
  
  // Financing fields (optional)
  useFinancing: z.boolean().default(false),
  downPayment: z
    .number()
    .min(0, "Down payment cannot be negative")
    .optional(),
  interestRate: z
    .number()
    .min(0, "Interest rate cannot be negative")
    .max(50, "Interest rate seems too high") // Realistic max
    .optional(),
  loanTermYears: z
    .number()
    .int()
    .min(1, "Loan term must be at least 1 year")
    .max(30, "Loan term cannot exceed 30 years") // Max 30 years
    .optional(),
  closingCosts: z
    .number()
    .min(0, "Closing costs cannot be negative")
    .optional(),
  
  notes: z
    .string()
    .max(5000, "Notes must be less than 5000 characters")
    .optional()
    .or(z.literal("")),
});

// Schema with refinements for validation
export const createDealSchema = baseDealSchema.refine(
  (data) => {
    // Only validate if financing is enabled
    if (!data.useFinancing) return true;
    // Down payment must be <= purchase price
    return (data.downPayment ?? 0) <= data.purchasePrice;
  },
  {
    message: "Down payment cannot exceed purchase price",
    path: ["downPayment"],
  }
).refine(
  (data) => {
    // Only validate if financing is enabled
    if (!data.useFinancing) return true;
    // Down payment should be at least something (typically 10-20%)
    const minDownPayment = data.purchasePrice * 0.05; // At least 5%
    return (data.downPayment ?? 0) >= minDownPayment;
  },
  {
    message: "Down payment should be at least 5% of purchase price",
    path: ["downPayment"],
  }
);

export type CreateDealInput = z.infer<typeof baseDealSchema>;

export const updateDealSchema = baseDealSchema.partial();

export type UpdateDealInput = z.infer<typeof updateDealSchema>;

export const updateDealStatusSchema = z.object({
  status: z.enum([
    "ANALYZING",
    "APPROVED",
    "REJECTED",
    "PURCHASED",
    "RENOVATING",
    "FOR_SALE",
    "SOLD",
  ]),
});

export type UpdateDealStatusInput = z.infer<typeof updateDealStatusSchema>;
