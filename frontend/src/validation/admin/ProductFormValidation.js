import * as z from 'zod';

export const productValidationSchema = z.object({
  productName: z.string().min(3, { message: "Product name must be at least 3 characters" }),
  image: z.string().url({ message: "Invalid image URL" }),
  category: z.string().min(1, { message: "Please select a category" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  brand: z.string().min(2, { message: "Brand name must be at least 2 characters" }),
  originalPrice: z.number().positive({ message: "Original price must be positive" }),
  offerPrice: z.number().positive({ message: "Offer price must be positive" }),
  stockQuantity: z.number().int().min(0, { message: "Stock quantity must be non-negative" }),
  colorOption: z.array(z.string()).min(1, { message: "At least 1 color is required" }),
  returnPolicy: z.string().min(5, { message: "Return policy must be at least 5 characters" }),
  sizeOption: z.array(z.string()).min(1, { message: "At least 1 size is required" }),

});

