import * as z from "zod";


export const addressSchema = z.object({
  username: z.string().min(1, "Full name is required").max(50, "Full name cannot exceed 50 characters"),
  phone: z.string()
    .min(10, "Phone number must be at least 10 characters")
    .max(15, "Phone number is too long")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),
  zipCode: z.string()
    .length(6, "Pincode must be exactly 6 digits")
    .regex(/^[0-9]+$/, "Pincode must contain only digits"),
  house: z.string().min(5, "Address is required").max(100, "Address cannot exceed 100 characters"),
  street: z.string().min(5, "Area/Street is required").max(100, "Street name cannot exceed 100 characters"),
  landmark: z.string().max(50, "Landmark cannot exceed 50 characters"), 
  city: z.string().min(3, "City is required").max(50, "City name cannot exceed 50 characters"),
  state: z.string().min(2, "State is required").max(50, "State name cannot exceed 50 characters"),
});
