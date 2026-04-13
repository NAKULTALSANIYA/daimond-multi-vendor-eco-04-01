import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    password: z.string().min(8).max(64),
    role: z.enum(['USER', 'VENDOR']).optional(),
    phone: z.string().regex(/^[0-9]{10,15}$/).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email().optional(),
    phone: z.string().regex(/^[0-9]{10,15}$/).optional(),
    password: z.string().min(8).max(64),
  }).refine((data) => Boolean(data.email || data.phone), {
    message: 'Either email or phone is required',
    path: ['email'],
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
