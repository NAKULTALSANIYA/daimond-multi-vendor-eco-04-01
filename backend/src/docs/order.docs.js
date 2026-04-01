/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Order management & payment APIs
 *
 * /orders:
 *   post:
 *     summary: Place new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - shippingAddress
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *               shippingAddress:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *                   country:
 *                     type: string
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation error, not enough stock, or product unavailable
 *       401:
 *         description: Unauthorized
 *
 * /orders/my-orders:
 *   get:
 *     summary: Get user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [PLACED, CONFIRMED, SHIPPED, DELIVERED, CANCELLED]
 *     responses:
 *       200:
 *         description: User orders
 *       401:
 *         description: Unauthorized
 *
 * /orders/{orderId}/payment:
 *   post:
 *     summary: Initiate payment for order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentMethod:
 *                 type: string
 *                 enum: [RAZORPAY, MOCK]
 *     responses:
 *       200:
 *         description: Payment initiated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     orderId:
 *                       type: string
 *                     razorpayOrderId:
 *                       type: string
 *                     amount:
 *                       type: number
 *       404:
 *         description: Order not found
 *
 * /orders/vendor:
 *   get:
 *     summary: Get vendor's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [PLACED, CONFIRMED, SHIPPED, DELIVERED, CANCELLED]
 *     responses:
 *       200:
 *         description: Vendor orders
 *       403:
 *         description: Only vendors
 *
 * /orders/payments/verify-razorpay:
 *   post:
 *     summary: Verify Razorpay payment
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - razorpayOrderId
 *               - razorpayPaymentId
 *               - razorpaySignature
 *             properties:
 *               razorpayOrderId:
 *                 type: string
 *               razorpayPaymentId:
 *                 type: string
 *               razorpaySignature:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment verified successfully
 *       400:
 *         description: Invalid signature
 *
 * /orders/payments/mock/{paymentId}/success:
 *   post:
 *     summary: Mock payment success (dev/testing only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: paymentId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mock payment marked as successful
 *       404:
 *         description: Payment not found
 *
 * /orders/vendor/{orderId}/status:
 *   patch:
 *     summary: Update order status (vendor only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: orderId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [CONFIRMED, SHIPPED, DELIVERED, CANCELLED]
 *     responses:
 *       200:
 *         description: Order status updated
 *       404:
 *         description: Order not found
 *       403:
 *         description: Not authorized
 */

export const orderDocs = {};