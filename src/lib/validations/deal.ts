import { z } from "zod";

// Deal Creation Schema
export const createDealSchema = z.object({
  name: z
    .string()
    .min(1, "Deal name is required")
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be less than 100 characters"),
  address: z
    .string()
    .max(200, "Address must be less than 200 characters")
    .optional(),
  propertyType: z.enum([
    "RESIDENTIAL",
    "COMMERCIAL", 
    "LAND",
    "INDUSTRIAL",
    "MIXED",
  ]).default("RESIDENTIAL"),
  purchasePrice: z
    .number()
    .positive("Purchase price must be positive")
    .max(999999999999, "Price is too high"),
  estimatedCosts: z
    .number()
    .min(0, "Costs cannot be negative")
    .default(0),
  estimatedSalePrice: z
    .number()
    .positive("Sale price must be positive")
    .max(999999999999, "Price is too high"),
  estimatedTimeMonths: z
    .number()
    .int()
    .min(1, "Time must be at least 1 month")
    .max(120, "Time must be less than 10 years")
    .default(12),
  notes: z
    .string()
    .max(5000, "Notes must be less than 5000 characters")
    .optional(),
});

export type CreateDealInput = z.infer<typeof createDealSchema>;

// Deal Update Schema (all fields optional)
export const updateDealSchema = createDealSchema.partial();

export type UpdateDealInput = z.infer<typeof updateDealSchema>;

// Deal Status Update Schema
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

