import * as z from 'zod';

export const productValidationSchema = z.object({
  productName: z.string()
    .min(3, { message: "Product name must be at least 3 characters" })
    .refine((v) => v.trim().length >= 3, { message: "Product name cannot be empty or just spaces" }),
  image: z.any(), // Can be string (URL) or File object
  category: z.string().min(1, { message: "Please select a category" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  brand: z.string().min(2, { message: "Brand name must be at least 2 characters" }),
  basePrice: z.coerce.number().positive({ message: "Base price must be positive" }),
  baseOfferPrice: z.coerce.number().positive({ message: "Base offer price must be positive" }).optional(),
  returnPolicy: z.string().min(5, { message: "Return policy must be at least 5 characters" }),

  // Variants array validation
  variants: z.array(z.object({
    color: z.string().min(1, { message: "Color is required" }),
    size: z.string().min(1, { message: "Size is required" }),
    stockQuantity: z.number().int().min(0, { message: "Stock must be 0 or greater" }),
    price: z.number().positive().optional(),
    offerPrice: z.number().positive().optional(),
    image: z.any().optional(), // Can be string (URL) or File object
  })).min(1, { message: "At least one variant is required" }),
}).refine((data) => {
  // Check if baseOfferPrice is less than or equal to basePrice
  if (data.baseOfferPrice && data.basePrice) {
    return data.baseOfferPrice <= data.basePrice;
  }
  return true;
}, {
  message: "Base offer price cannot be greater than base price",
  path: ["baseOfferPrice"],
});
