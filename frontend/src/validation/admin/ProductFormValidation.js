import * as z from 'zod';

export const productValidationSchema = z.object({
  productName: z.string()
    .min(3, { message: "Product name must be at least 3 characters" })
    .refine((v) => v.trim().length >= 3, { message: "Product name cannot be empty or just spaces" }),
  image: z.string().url({ message: "Invalid image URL" }),
  category: z.string().min(1, { message: "Please select a category" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  brand: z.string().min(2, { message: "Brand name must be at least 2 characters" }),
  originalPrice: z.coerce.number().positive({ message: "Original price must be positive" }),
  offerPrice: z.coerce.number().positive({ message: "Offer price must be positive" }),
  stockQuantity: z.coerce.number().int().min(0, { message: "Stock quantity must be non-negative" }),
  colorOption: z.array(z.string()).min(1, { message: "At least 1 color is required" }),
  returnPolicy: z.string().min(5, { message: "Return policy must be at least 5 characters" }),
  sizeOption: z.array(z.string()).min(1, { message: "At least 1 size is required" }),
}).refine((data) => data.offerPrice <= data.originalPrice, {
  message: "Offer price cannot be greater than original price",
  path: ["offerPrice"],
});

