import { z } from "zod";

export const contactSchema = z.object({

  name: z
  .string()
  .min(1, 'Full name is required')
  .max(50, 'Name must be less than 50 characters'),
  
  email: z
  .string().
  email('Please enter a valid email').min(1, 'Email is required'),
  
  message: z.
  string()
  .min(1, 'Message is required')
  .max(500, 'Message must be less than 500 characters'),

});