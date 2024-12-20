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
  variantImages: z.array(imageValidationSchema).optional().refine((images) => {
    return !images || images.length > 0;
  }, {
    message: "At least one variant image is required"
  })
});

// Validation for image variants
export const validateImageVariants = (files) => {
  try {
    console.log("Files to validate: ", files); // Log to check the files

    // Ensure we only validate non-null files and that they are File objects
    const nonNullFiles = files.filter(file => file !== null && file !== undefined);
    console.log(nonNullFiles, "Files before validation");

    // Ensure that all files are of type File
    const validatedFiles = nonNullFiles.map(file => {
      if (!(file instanceof File)) {
        throw new Error("All files must be instances of File");
      }
      return imageValidationSchema.parse(file);
    });

    console.log(validatedFiles, "Validated Files");
    return validatedFiles;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors.map(e => e.message).join(', '));
    }
    throw error;
  }
};
