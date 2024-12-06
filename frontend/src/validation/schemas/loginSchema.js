import { z } from 'zod';

export const loginSchema = z.object({
    username: z
    .string()
    .min(3, { message: 'at least 3 characters' })
    .max(20, { message: 'not exceed 20 characters' }),

    email: z
    .string()
    .email({ message: 'Invalid email address' }),
    

})