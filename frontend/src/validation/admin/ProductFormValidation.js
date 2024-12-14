import * as z from 'zod';

// Image validation schema
const imageValidationSchema = z.instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, {
    message: "Image must be less than 5MB"
  })
  .refine((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), {
    message: "Only JPEG, PNG, and WebP images are allowed"
  });

// Product validation schema
export const productValidationSchema = z.object({
  productName: z.string().min(3, { message: "Product name must be at least 3 characters" }).optional(),
  imageUrl: z.string().url({ message: "Invalid image URL" }).optional(),
  category: z.string().min(1, { message: "Please select a category" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }).optional(),
  brandName: z.string().min(2, { message: "Brand name must be at least 2 characters" }).optional(),
  originalPrice: z.number().positive({ message: "Original price must be positive" }).optional(),
  offerPrice: z.number().positive({ message: "Offer price must be positive" }).optional(),
  stockQuantity: z.number().int().min(0, { message: "Stock quantity must be non-negative" }).optional(),
  warrantyTime: z.number().int().min(0, { message: "Warranty time must be non-negative" }).optional(),
  returnPolicy: z.string().min(5, { message: "Return policy must be at least 5 characters" }).optional(),
  sizes: z.array(z.string()).min(1, { message: "At least 1 size is required" }).optional(),
  variants: z.array(imageValidationSchema).optional().refine((images) => images.length > 0, {
    message: "At least one variant image is required"
  })
});

// Validation for image variants
export const validateImageVariants = (files) => {
  try {
    // Ensure we only validate non-null files
    const nonNullFiles = files.filter(file => file !== null && file !== undefined);

    // Validate each file directly
    const validatedFiles = nonNullFiles.map(file => imageValidationSchema.parse(file));

    return validatedFiles;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors.map(e => e.message).join(', '));
    }
    throw error;
  }
};
