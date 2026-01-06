import * as z from "zod";

const namePattern = /^[A-Za-z][A-Za-z\s.'-]*$/;
const noEmoji = /^(?!.*([\uD83C-\uDBFF\uDC00-\uDFFF]|[\u2600-\u27BF])).*$/;

export const addressSchema = z.object({
  fullName: z.string()
    .trim()
    .min(1, "Full name is required")
    .max(50, "Full name cannot exceed 50 characters")
    .regex(namePattern, 'Use letters, spaces, apostrophes, periods, and hyphens only')
    .regex(noEmoji, 'Name cannot include emojis'),
  phone: z.string()
    .trim()
    .regex(/^\+?[0-9]{10,15}$/, 'Enter a valid phone number'),
  zipCode: z.string()
    .trim()
    .regex(/^[0-9]{4,10}$/i, 'Enter a valid postal code'),
  house: z.string()
    .trim()
    .min(5, "Address is required")
    .max(100, "Address cannot exceed 100 characters"),
  street: z.string()
    .trim()
    .min(3, "Area/Street is required")
    .max(100, "Street name cannot exceed 100 characters"),
  landmark: z.string()
    .trim()
    .max(50, "Landmark cannot exceed 50 characters")
    .optional()
    .or(z.literal('')),
  city: z.string()
    .trim()
    .min(2, "City is required")
    .max(50, "City name cannot exceed 50 characters")
    .regex(/^[A-Za-z][A-Za-z\s.'-]*$/, 'Use letters and separators only'),
  state: z.string()
    .trim()
    .min(2, "State is required")
    .max(50, "State name cannot exceed 50 characters")
    .regex(/^[A-Za-z][A-Za-z\s.'-]*$/, 'Use letters and separators only'),
});
