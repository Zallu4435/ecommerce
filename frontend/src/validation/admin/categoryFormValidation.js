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
  });
  