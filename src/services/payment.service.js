import Razorpay from 'razorpay';
import crypto from 'crypto';
import { env } from '../config/env.js';
import { Order } from '../models/Order.js';
import { Payment } from '../models/Payment.js';
import { PAYMENT_STATUS } from '../constants/roles.js';
import { ApiError } from '../utils/ApiError.js';

const razorpay = env.razorpayKeyId && env.razorpayKeySecret
  ? new Razorpay({ key_id: env.razorpayKeyId, key_secret: env.razorpayKeySecret })
  : null;

export class PaymentService {
  async createOrderPayment(userId, orderId) {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) throw new ApiError(404, 'Order not found');

    if (!razorpay) {
      // Reuse existing MOCK payment if one already exists (avoids duplicate key error)
      let payment = await Payment.findOne({ order: order._id, provider: 'MOCK' });
      if (!payment) {
        payment = await Payment.create({
          order: order._id,
          user: userId,
          provider: 'MOCK',
          amount: order.totalAmount,
          status: PAYMENT_STATUS.PENDING,
        });
      }
      return { provider: 'MOCK', payment };
    }

    const rpOrder = await razorpay.orders.create({
      amount: Math.round(order.totalAmount * 100),
      currency: 'INR',
      receipt: order.orderNumber,
      payment_capture: true,
    });

    const payment = await Payment.create({
      order: order._id,
      user: userId,
      provider: 'RAZORPAY',
      providerOrderId: rpOrder.id,
      amount: order.totalAmount,
      status: PAYMENT_STATUS.PENDING,
      rawResponse: rpOrder,
    });

    return { provider: 'RAZORPAY', payment, razorpayOrder: rpOrder };
  }

  async verifyRazorpayPayment({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) {
    if (!razorpay) throw new ApiError(400, 'Razorpay is not configured');

    const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expected = crypto.createHmac('sha256', env.razorpayKeySecret).update(payload).digest('hex');

    if (expected !== razorpaySignature) {
      throw new ApiError(400, 'Payment signature verification failed');
    }

    const payment = await Payment.findOneAndUpdate(
      { providerOrderId: razorpayOrderId },
      {
        providerPaymentId: razorpayPaymentId,
        status: PAYMENT_STATUS.PAID,
      },
      { new: true }
    );

    if (!payment) throw new ApiError(404, 'Payment record not found');

    await Order.findByIdAndUpdate(payment.order, { paymentStatus: PAYMENT_STATUS.PAID, orderStatus: 'CONFIRMED' });

    return payment;
  }

  async markMockPaymentSuccess(userId, paymentId) {
    const payment = await Payment.findOneAndUpdate(
      { _id: paymentId, user: userId, provider: 'MOCK' },
      { status: PAYMENT_STATUS.PAID },
      { new: true }
    );

    if (!payment) throw new ApiError(404, 'Payment record not found');
    await Order.findByIdAndUpdate(payment.order, { paymentStatus: PAYMENT_STATUS.PAID, orderStatus: 'CONFIRMED' });

    return payment;
  }

  /**
   * Atomic mock-pay: find-or-create MOCK payment for the order, then mark it PAID.
   * A single endpoint so the Flutter client never needs two separate API calls.
   */
  async atomicMockPay(userId, orderId) {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) throw new ApiError(404, 'Order not found');

    if (order.paymentStatus === PAYMENT_STATUS.PAID) {
      throw new ApiError(400, 'Order is already paid');
    }

    let payment = await Payment.findOne({ order: order._id, provider: 'MOCK', user: userId });
    if (!payment) {
      payment = await Payment.create({
        order: order._id,
        user: userId,
        provider: 'MOCK',
        amount: order.totalAmount,
        status: PAYMENT_STATUS.PENDING,
      });
    }

    payment.status = PAYMENT_STATUS.PAID;
    await payment.save();

    await Order.findByIdAndUpdate(order._id, {
      paymentStatus: PAYMENT_STATUS.PAID,
      orderStatus: 'CONFIRMED',
    });

    return payment;
  }
}

export const paymentService = new PaymentService();
