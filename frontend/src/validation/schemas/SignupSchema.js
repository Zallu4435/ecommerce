import { z } from 'zod';

const noEmoji = /^(?!.*([\uD83C-\uDBFF\uDC00-\uDFFF]|[\u2600-\u27BF])).*$/;
const asciiVisible = /^[ -~]+$/;

const usernameField = z
  .string()
  .trim()
  .min(3, { message: 'Username must be at least 3 characters' })
  .max(20, { message: 'Username must not exceed 20 characters' })
  .regex(/^[A-Za-z][A-Za-z0-9_.-]*$/, {
    message: 'Start with a letter; only letters, numbers, dot, dash, underscore',
  })
  .regex(noEmoji, { message: 'Username cannot include emojis' });

const emailField = z
  .string()
  .trim()
  .min(1, { message: 'Email is required' })
  .max(254, { message: 'Email is too long' })
  .email({ message: 'Invalid email address' });

const phoneField = z
  .string()
  .trim()
  .regex(/^\+?[0-9]{10,15}$/, { message: 'Enter a valid phone number' });

const strongPassword = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters' })
  .max(64, { message: 'Password must not exceed 64 characters' })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[ -~]+$/, {
    message:
      'Password must include upper, lower, number and symbol, and contain no spaces or emojis',
  })
  .regex(asciiVisible, { message: 'Password cannot contain emojis or non-ASCII' });

export const signupSchema = z
  .object({
    username: usernameField,
    email: emailField,
    phone: phoneField,
    password: strongPassword,
    confirmPassword: z.string(),
    referralCode: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });