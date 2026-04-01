import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { PAYMENT_STATUS } from '../constants/roles.js';
import { softDeletePlugin } from './plugins/softDelete.plugin.js';

const paymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    provider: { type: String, enum: ['RAZORPAY', 'MOCK'], default: 'MOCK' },
    providerOrderId: { type: String, index: true },
    providerPaymentId: { type: String, index: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: 'INR', uppercase: true, minlength: 3, maxlength: 3 },
    status: { type: String, enum: Object.values(PAYMENT_STATUS), default: PAYMENT_STATUS.PENDING, index: true },
    rawResponse: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

paymentSchema.plugin(softDeletePlugin);
paymentSchema.plugin(mongoosePaginate);

paymentSchema.index({ order: 1, provider: 1 }, { unique: true });

export const Payment = mongoose.model('Payment', paymentSchema);
