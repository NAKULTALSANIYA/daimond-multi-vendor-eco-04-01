import mongoose from 'mongoose';
import { softDeletePlugin } from './plugins/softDelete.plugin.js';

const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    quantity: { type: Number, required: true, min: 1, max: 99 },
    unitPrice: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    items: { type: [cartItemSchema], default: [] },
    couponCode: { type: String, trim: true, uppercase: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

cartSchema.plugin(softDeletePlugin);

cartSchema.virtual('subtotal').get(function subtotal() {
  return this.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
});

export const Cart = mongoose.model('Cart', cartSchema);
