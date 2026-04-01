import { orderService } from '../services/order.service.js';
import { paymentService } from '../services/payment.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const placeOrder = asyncHandler(async (req, res) => {
  const order = await orderService.placeOrder(req.user._id, req.validated.body);
  res.status(201).json(new ApiResponse(201, 'Order placed', order));
});

export const userOrders = asyncHandler(async (req, res) => {
  const result = await orderService.userOrders(req.user._id, req.query);
  res.status(200).json(new ApiResponse(200, 'Order history fetched', result.docs, {
    page: result.page,
    totalPages: result.totalPages,
    totalDocs: result.totalDocs,
  }));
});

export const vendorOrders = asyncHandler(async (req, res) => {
  const result = await orderService.vendorOrders(req.vendor._id, req.query);
  res.status(200).json(new ApiResponse(200, 'Vendor orders fetched', result.docs, {
    page: result.page,
    totalPages: result.totalPages,
    totalDocs: result.totalDocs,
  }));
});

export const updateVendorOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateVendorOrderStatus(req.vendor._id, req.params.orderId, req.validated.body.orderStatus);
  res.status(200).json(new ApiResponse(200, 'Order status updated', order));
});

export const createPayment = asyncHandler(async (req, res) => {
  const payment = await paymentService.createOrderPayment(req.user._id, req.params.orderId);
  res.status(200).json(new ApiResponse(200, 'Payment initiated', payment));
});

export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const payment = await paymentService.verifyRazorpayPayment(req.body);
  res.status(200).json(new ApiResponse(200, 'Payment verified', payment));
});

export const markMockPaymentSuccess = asyncHandler(async (req, res) => {
  const payment = await paymentService.markMockPaymentSuccess(req.user._id, req.params.paymentId);
  res.status(200).json(new ApiResponse(200, 'Mock payment marked as successful', payment));
});

export const atomicMockPay = asyncHandler(async (req, res) => {
  const payment = await paymentService.atomicMockPay(req.user._id, req.params.orderId);
  res.status(200).json(new ApiResponse(200, 'Payment successful', payment));
});
