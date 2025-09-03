import { z } from 'zod';

const emailField = z
  .string()
  .trim()
  .min(1, { message: 'Email is required' })
  .max(254, { message: 'Email is too long' })
  .email({ message: 'Invalid email address' });

// Visible ASCII only, require upper, lower, digit, and symbol, disallow spaces/emojis
const strongPassword = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters' })
  .max(64, { message: 'Password must not exceed 64 characters' })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[ -~]+$/, {
    message:
      'Password must include upper, lower, number and symbol, and contain no spaces or emojis',
  });

export const regularLoginSchema = z.object({
  email: emailField,
  password: strongPassword,
});

export const otpLoginSchema = z.object({
  email: emailField,
});

export const otpResetSchema = z.object({
  email: emailField,
});