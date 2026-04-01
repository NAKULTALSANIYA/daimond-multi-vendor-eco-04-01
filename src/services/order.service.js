import { Cart } from '../models/Cart.js';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Address } from '../models/Address.js';
import { ApiError } from '../utils/ApiError.js';
import { buildPagination } from '../utils/query.js';

const generateOrderNumber = () => `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

export class OrderService {
  async placeOrder(userId, { addressId, paymentMethod = 'MOCK', notes = '' }) {
    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0) throw new ApiError(400, 'Cart is empty');

    const address = await Address.findOne({ _id: addressId, user: userId });
    if (!address) throw new ApiError(404, 'Address not found');

    const items = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive || product.isDeleted) throw new ApiError(400, 'Product unavailable');
      if (product.stock < item.quantity) throw new ApiError(400, `Insufficient stock for ${product.name}`);

      product.stock -= item.quantity;
      await product.save();

      const totalPrice = item.quantity * item.unitPrice;
      subtotal += totalPrice;

      items.push({
        product: product._id,
        vendor: product.vendor,
        name: product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice,
      });
    }

    const tax = Number((subtotal * 0.05).toFixed(2));
    const shippingFee = subtotal > 1000 ? 0 : 50;
    const totalAmount = subtotal + tax + shippingFee;

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      user: userId,
      address: address._id,
      items,
      subtotal,
      tax,
      shippingFee,
      totalAmount,
      paymentMethod,
      notes,
    });

    cart.items = [];
    await cart.save();

    return order;
  }

  async userOrders(userId, query) {
    const { page, limit, sort } = buildPagination(query);
    return Order.paginate(
      { user: userId },
      { page, limit, sort, populate: [{ path: 'items.product', select: 'name images' }] }
    );
  }

  async vendorOrders(vendorId, query) {
    const { page, limit, sort } = buildPagination(query);
    return Order.paginate({ 'items.vendor': vendorId }, { page, limit, sort, populate: [{ path: 'user', select: 'name email' }] });
  }

  async updateVendorOrderStatus(vendorId, orderId, orderStatus) {
    const order = await Order.findOne({ _id: orderId, 'items.vendor': vendorId });
    if (!order) throw new ApiError(404, 'Order not found');

    order.orderStatus = orderStatus;
    await order.save();
    return order;
  }
}

export const orderService = new OrderService();
