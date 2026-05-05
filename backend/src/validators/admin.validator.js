import { z } from 'zod';

const orderSchema = z.preprocess(
  (value) => (value === '' || value === null ? undefined : value),
  z.coerce.number().int().min(0).optional()
);

const categoryBodyBaseSchema = z.object({
  name: z.string().min(2).max(80),
  slug: z.string().min(2).max(80),
  description: z.string().max(500).optional(),
  order: orderSchema,
  sort_order: orderSchema,
  sortOrder: orderSchema,
});

const categoryBodySchema = categoryBodyBaseSchema.transform((body) => {
    const normalizedOrder = body.order ?? body.sort_order ?? body.sortOrder;
    return {
      name: body.name,
      slug: body.slug,
      description: body.description,
      ...(normalizedOrder !== undefined ? { order: normalizedOrder } : {}),
    };
  });

export const vendorDecisionSchema = z.object({
  body: z.object({
    decision: z.enum(['APPROVED', 'REJECTED']),
  }),
  query: z.object({}).optional(),
  params: z.object({ vendorId: z.string().min(1) }),
});

export const categorySchema = z.object({
  body: categoryBodySchema,
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const categoryUpdateSchema = z.object({
  body: categoryBodyBaseSchema.partial().transform((body) => {
    const normalizedOrder = body.order ?? body.sort_order ?? body.sortOrder;
    return {
      ...(body.name !== undefined ? { name: body.name } : {}),
      ...(body.slug !== undefined ? { slug: body.slug } : {}),
      ...(body.description !== undefined ? { description: body.description } : {}),
      ...(normalizedOrder !== undefined ? { order: normalizedOrder } : {}),
    };
  }),
  query: z.object({}).optional(),
  params: z.object({ categoryId: z.string().min(1) }),
});

export const blockStatusSchema = z.object({
  body: z.object({
    isBlocked: z.boolean(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const commissionSchema = z.object({
  body: z.object({
    commissionRate: z.number().min(0).max(100),
  }),
  query: z.object({}).optional(),
  params: z.object({ vendorId: z.string().min(1) }),
});
