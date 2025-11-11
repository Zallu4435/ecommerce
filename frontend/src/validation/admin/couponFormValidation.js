import { z } from "zod";

const numberField = z
  .union([z.string(), z.number()])
  .transform((val) => typeof val === 'string' ? Number(val) : val)
  .refine((val) => !isNaN(val), {
    message: "Must be a valid number",
  });

const couponSchema = z.object({
  couponCode: z.string()
    .min(3, "Coupon code must be at least 3 characters")
    .max(50, "Coupon code cannot exceed 50 characters")
    .regex(/^[A-Z0-9_-]+$/i, "Coupon code can only contain letters, numbers, hyphens, and underscores"),
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description cannot exceed 500 characters"),
  discount: numberField
    .refine((n) => n >= 1 && n <= 70, {
      message: "Discount must be between 1 and 70 percent",
    }),
  minAmount: numberField
    .refine((n) => n >= 500 && n <= 100000, {
      message: "Minimum purchase amount must be between ₹500 and ₹1,00,000",
    }),
  maxAmount: numberField
    .refine((n) => n >= 1 && n <= 5000, {
      message: "Maximum discount amount must be between ₹1 and ₹5,000",
    }),
  expiry: z.string().min(1, "Expiry date is required").refine((val) => {
    const d = new Date(val);
    const today = new Date();
    today.setHours(0,0,0,0);
    
    // Check if date is valid and in the future
    if (!(d instanceof Date) || isNaN(d) || d <= today) {
      return false;
    }
    
    // Check if date is not more than 2 years in the future
    const twoYearsFromNow = new Date();
    twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
    if (d > twoYearsFromNow) {
      return false;
    }
    
    return true;
  }, { message: "Expiry must be a future date (max 2 years ahead)" }),
  usageLimit: z.union([z.string(), z.number()]).optional().transform((val) => {
    if (val === "" || val === null || val === undefined) return null;
    return typeof val === 'string' ? Number(val) : val;
  }).refine((val) => {
    if (val === null || val === undefined) return true;
    return Number.isInteger(val) && val > 0;
  }, { message: "Usage limit must be a positive integer or leave empty for unlimited" }),
  perUserLimit: z.union([z.string(), z.number()]).optional().transform((val) => {
    if (val === "" || val === null || val === undefined) return 1;
    return typeof val === 'string' ? Number(val) : val;
  }).refine((val) => {
    return Number.isInteger(val) && val >= 1 && val <= 5;
  }, { message: "Per user limit must be between 1 and 5" }),
}).refine(data => {
  // Validate minimum purchase is at least 5x the max discount
  return Number(data.minAmount) >= Number(data.maxAmount) * 5;
}, {
  message: "Minimum purchase amount must be at least 5 times the maximum discount amount",
  path: ["minAmount"],
});

export default couponSchema;