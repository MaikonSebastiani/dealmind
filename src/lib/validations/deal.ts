import { z } from "zod";

export const createDealSchema = z.object({
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
    .max(120, "Time must be less than 10 years"),
  notes: z
    .string()
    .max(5000, "Notes must be less than 5000 characters")
    .optional()
    .or(z.literal("")),
});

export type CreateDealInput = z.infer<typeof createDealSchema>;

export const updateDealSchema = createDealSchema.partial();

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
