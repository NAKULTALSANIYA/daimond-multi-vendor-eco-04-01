import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    category: z.string().min(1),
    name: z.string().min(2).max(180),
    slug: z
      .string()
      .trim()
      .min(2)
      .max(200)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase letters, numbers, and hyphens only')
      .optional(),
    description: z.string().min(10).max(3000),
    price: z.number().nonnegative(),
    discountPrice: z.number().nonnegative().optional(),
    sku: z.string().min(2).max(40),
    stock: z.number().int().nonnegative(),
    tags: z.array(z.string()).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateProductSchema = z.object({
  body: createProductSchema.shape.body.partial(),
  query: z.object({}).optional(),
  params: z.object({ productId: z.string().min(1) }),
});
