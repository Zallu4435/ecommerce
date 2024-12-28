import { z } from 'zod';

const numberString = z.string().refine((val) => !isNaN(Number(val)), {
  message: "Must be a valid number",
});

export const couponSchema = z.object({
  couponCode: z
    .string()
    .min(1, "Coupon code is required")
    .max(50, "Coupon code must be at most 50 characters long"),

  title: z
    .string()
    .min(3, "Coupon title must be at least 3 characters long")
    .max(100, "Coupon title must be at most 100 characters long"),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(500, "Description must be at most 500 characters long"),

  discount: numberString.transform(Number)
    .refine((val) => val > 0, "Discount must be a positive number"),

  minAmount: numberString.transform(Number)
    .refine((val) => val > 0, "Min amount must be a positive number"),

  maxAmount: numberString.transform(Number)
    .refine((val) => val > 0, "Max amount must be a positive number"),

  expiry: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Expiry must be a valid date")
    .refine((val) => Date.parse(val) > Date.now(), "Expiry date must be in the future"),
});

