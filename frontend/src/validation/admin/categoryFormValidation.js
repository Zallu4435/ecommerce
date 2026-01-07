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
    .transform((val) => typeof val === 'string' ? (val === '' ? 0 : Number(val)) : val) // Convert string to number, handle empty string
    .refine((val) => !isNaN(val), "Category offer must be a valid number")
    .refine((val) => val >= 0, "Category offer must be at least 0")
    .refine((val) => val <= 100, "Category offer cannot exceed 100")
    .optional(),
  offerName: z.string().optional(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  isOfferActive: z.boolean().optional(),
}).refine((data) => {
  // If any offer field is present and non-empty, dates are required
  const hasOffer = (data.categoryOffer && data.categoryOffer > 0) ||
    (data.offerName && data.offerName.trim().length > 0) ||
    data.isOfferActive;
  if (hasOffer) {
    return !!data.startDate;
  }
  return true;
}, {
  message: "Start date is required for offer",
  path: ["startDate"],
}).refine((data) => {
  const hasOffer = (data.categoryOffer && data.categoryOffer > 0) ||
    (data.offerName && data.offerName.trim().length > 0) ||
    data.isOfferActive;
  if (hasOffer) {
    return !!data.endDate;
  }
  return true;
}, {
  message: "End date is required for offer",
  path: ["endDate"],
}).refine((data) => {
  if (data.startDate && data.endDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    return end > start;
  }
  return true;
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});
