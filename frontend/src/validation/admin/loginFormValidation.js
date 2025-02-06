import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address.")
    .min(1, "Email is required."),
  password: z
    .string()
    .min(4, "Password must be at least 6 characters long.")
    .max(20, "Password must be less than 20 characters long.")
    .min(1, "Password is required."),
});
