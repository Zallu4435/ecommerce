import { z } from "zod";

export const categorySchema = z.object({
  categoryName: z
    .string()
    .min(1, "Category name is required")
    .refine((value) => value.trim().length > 0, "Category name cannot be empty or just spaces"),
  categoryDescription: z
    .string()
    .min(10, "Category description is required")
    .refine((value) => value.trim().length > 0, "Category description cannot be just spaces"),
  categoryOffer: z
    .union([z.string(), z.number()]) // Accept both string and number
    .transform((val) => typeof val === 'string' ? Number(val) : val) // Convert string to number
    .refine((val) => !isNaN(val), "Category offer must be a valid number")
    .refine((val) => val >= 0, "Category offer must be at least 0")
    .refine((val) => val <= 100, "Category offer cannot exceed 100")
    .refine((val) => val <= 100, "Category offer cannot exceed 100")
    .optional(),
  offerName: z.string().optional(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  isOfferActive: z.boolean().optional(),

});
