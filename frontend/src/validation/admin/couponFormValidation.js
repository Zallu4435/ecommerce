import { z } from "zod";

const numberString = z
  .string()
  .refine((val) => !isNaN(Number(val)) && val.trim() !== '', {
    message: "Must be a valid number",
  });

const couponSchema = z.object({
  couponCode: z.string().min(1, "Coupon code is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  discount: numberString.transform(val => Number(val)),
  minAmount: numberString.transform(val => Number(val)),
  maxAmount: numberString.transform(val => Number(val)),
  expiry: z.string().min(1, "Expiry date is required"),
}).refine(data => Number(data.minAmount) <= Number(data.maxAmount), {
  message: "Minimum amount must be less than or equal to maximum amount",
  path: ["maxAmount"],
});

export default couponSchema;