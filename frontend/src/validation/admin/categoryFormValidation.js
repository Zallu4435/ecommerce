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
    .string() // Accept as a string from the input field
    .refine((val) => !isNaN(Number(val)), "Category offer must be a valid number") // Check if it's a number
    .transform((val) => Number(val)) // Convert to a number
    .refine((val) => val >= 0, "Category offer must be at least 0")
    .refine((val) => val <= 100, "Category offer cannot exceed 100")
    .optional(),
  
});
  