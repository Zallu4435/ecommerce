import { z } from 'zod';

const asciiVisible = /^[ -~]+$/;

const strongPassword = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters' })
  .max(64, { message: 'Password must not exceed 64 characters' })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s])[ -~]+$/, {
    message:
      'Password must include upper, lower, number and symbol, and contain no spaces or emojis',
  })
  .regex(asciiVisible, { message: 'Password cannot contain emojis or non-ASCII' });

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: 'Current password is required' }),
    newPassword: strongPassword,
    confirmPassword: z.string().min(1, { message: 'Please confirm your new password' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'New password and confirm password must match',
  });


