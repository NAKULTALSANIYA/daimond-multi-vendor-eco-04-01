import { Router } from 'express';
import {
  atomicMockPay,
  createPayment,
  markMockPaymentSuccess,
  placeOrder,
  updateVendorOrderStatus,
  userOrders,
  vendorOrders,
  verifyRazorpayPayment,
} from '../controllers/order.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRoles } from '../middlewares/rbac.middleware.js';
import { ROLES } from '../constants/roles.js';
import { validate } from '../middlewares/validate.middleware.js';
import { placeOrderSchema, updateOrderStatusSchema } from '../validators/order.validator.js';
import { attachVendor } from '../middlewares/vendor.middleware.js';

const router = Router();

router.use(authMiddleware);

router.post('/', requireRoles(ROLES.USER), validate(placeOrderSchema), placeOrder);
router.get('/my-orders', requireRoles(ROLES.USER), userOrders);
router.post('/:orderId/payment', requireRoles(ROLES.USER), createPayment);
router.post('/:orderId/mock-pay', requireRoles(ROLES.USER), atomicMockPay);
router.post('/payments/verify-razorpay', verifyRazorpayPayment);
router.post('/payments/mock/:paymentId/success', requireRoles(ROLES.USER), markMockPaymentSuccess);

router.get('/vendor', requireRoles(ROLES.VENDOR), attachVendor, vendorOrders);
router.patch('/vendor/:orderId/status', requireRoles(ROLES.VENDOR), attachVendor, validate(updateOrderStatusSchema), updateVendorOrderStatus);

export default router;
