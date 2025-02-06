import { z } from 'zod';

export const regularLoginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(4, { message: 'at least 4 characters' })
    .max(12, { message: 'not exceed 12 characters' }),
});

export const otpLoginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email address' }),
});

export const otpResetSchema = z.object({
  email: z
    .string()
    .email({ message: 'Invalid email address' }),
});