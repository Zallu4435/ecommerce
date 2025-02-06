import { z } from 'zod';

export const signupSchema = z.object({
    username: z
    .string()
    .min(3, { message: 'at least 3 characters' })
    .max(20, { message: 'not exceed 20 characters' }),

    email: z
    .string()
    .email({ message: 'Invalid email address' }),

    phone: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, { message: 'Invalid phone number' }),

    password: z
    .string()
    .min(4, { message: 'at least 4 characters' })
    .max(12, { message: 'not exceed 12 characters' }),

    confirmPassword: z.string(),
    
})
.refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Password not matched',
})