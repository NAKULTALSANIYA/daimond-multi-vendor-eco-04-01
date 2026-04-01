import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { ORDER_STATUS, PAYMENT_STATUS } from '../constants/roles.js';
import { softDeletePlugin } from './plugins/softDelete.plugin.js';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    address: { type: mongoose.Schema.Types.ObjectId, ref: 'Address', required: true },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, default: 0, min: 0 },
    shippingFee: { type: Number, default: 0, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    totalAmount: { type: Number, required: true, min: 0, index: true },
    paymentStatus: { type: String, enum: Object.values(PAYMENT_STATUS), default: PAYMENT_STATUS.PENDING, index: true },
    orderStatus: { type: String, enum: Object.values(ORDER_STATUS), default: ORDER_STATUS.PLACED, index: true },
    paymentMethod: { type: String, enum: ['COD', 'RAZORPAY', 'MOCK'], default: 'MOCK' },
    notes: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

orderSchema.plugin(softDeletePlugin);
orderSchema.plugin(mongoosePaginate);

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ 'items.vendor': 1, orderStatus: 1, createdAt: -1 });

export const Order = mongoose.model('Order', orderSchema);
