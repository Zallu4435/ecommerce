import { z } from "zod";

const noEmoji = /^(?!.*([\uD83C-\uDBFF\uDC00-\uDFFF]|[\u2600-\u27BF])).*$/;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Full name is required')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[A-Za-z][A-Za-z\s.'-]*$/, 'Use letters, spaces, apostrophes, periods, and hyphens only')
    .regex(noEmoji, 'Name cannot include emojis'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .max(254, 'Email is too long')
    .email('Please enter a valid email'),
  message: z
    .string()
    .trim()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
});