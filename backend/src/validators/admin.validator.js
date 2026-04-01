import { z } from 'zod';

export const vendorDecisionSchema = z.object({
  body: z.object({
    decision: z.enum(['APPROVED', 'REJECTED']),
  }),
  query: z.object({}).optional(),
  params: z.object({ vendorId: z.string().min(1) }),
});

export const categorySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(80),
    slug: z.string().min(2).max(80),
    description: z.string().max(500).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const categoryUpdateSchema = z.object({
  body: categorySchema.shape.body.partial(),
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
