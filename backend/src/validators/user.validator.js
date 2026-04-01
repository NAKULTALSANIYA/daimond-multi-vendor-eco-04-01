import { z } from 'zod';

export const addAddressSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).max(80),
    phone: z.string().regex(/^[0-9]{10,15}$/),
    line1: z.string().min(2).max(200),
    line2: z.string().max(200).optional(),
    city: z.string().min(2).max(80),
    state: z.string().min(2).max(80),
    country: z.string().min(2).max(80),
    postalCode: z.string().min(4).max(12),
    label: z.enum(['HOME', 'WORK', 'OTHER']).optional(),
    isDefault: z.boolean().optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
