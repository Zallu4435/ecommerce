import * as z from "zod";


export const addressSchema = z.object({
  username: z.string().min(1, "Full name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 characters").max(15, "Phone number is too long"),
  zipCode: z.string().length(6, "Pincode must be exactly 6 digits"),
  house: z.string().min(5, "Address is required"),
  street: z.string().min(5, "Area/Street is required"),
  landmark: z.string().optional(),
  city: z.string().min(3, "City is required"),
  state: z.string().min(1, "State is required"),
});