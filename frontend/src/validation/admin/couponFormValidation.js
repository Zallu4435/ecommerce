import { z } from 'zod';

export const couponSchema = z.object({
  couponCode: z.string().min(1, "Coupon code is required"), // Required coupon code
  discount: z
    .string() // Allow as string but will validate as Decimal128 on backend
    .refine(val => !isNaN(parseFloat(val)), "Discount must be a valid number")
    .transform(val => parseFloat(val)), // Transform string to float (Decimal128 equivalent)
  minPurchase: z
    .string() // Allow as string but will validate as Decimal128 on backend
    .refine(val => !isNaN(parseFloat(val)), "Min purchase must be a valid number")
    .transform(val => parseFloat(val)), // Transform string to float (Decimal128 equivalent)
  expiry: z.string().refine(val => !isNaN(Date.parse(val)), "Expiry must be a valid date"), // Expiry date validation
  maxDiscount: z
    .string() // Allow as string but will validate as Decimal128 on backend
    .refine(val => !isNaN(parseFloat(val)), "Max discount must be a valid number")
    .transform(val => parseFloat(val)), // Transform string to float (Decimal128 equivalent)
});
