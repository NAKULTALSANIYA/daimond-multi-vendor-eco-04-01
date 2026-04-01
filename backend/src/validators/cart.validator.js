import { z } from 'zod';

export const addToCartSchema = z.object({
  body: z.object({
    productId: z.string().min(1),
    quantity: z.number().int().min(1).max(99),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
