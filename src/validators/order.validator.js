import { z } from 'zod';

export const placeOrderSchema = z.object({
  body: z.object({
    addressId: z.string().min(1),
    paymentMethod: z.enum(['COD', 'RAZORPAY', 'MOCK']).optional(),
    notes: z.string().max(500).optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    orderStatus: z.enum(['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  }),
  query: z.object({}).optional(),
  params: z.object({ orderId: z.string().min(1) }),
});
