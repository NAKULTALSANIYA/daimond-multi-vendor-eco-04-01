import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { softDeletePlugin } from './plugins/softDelete.plugin.js';

const vendorSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    storeName: { type: String, required: true, trim: true, minlength: 2, maxlength: 120, index: true },
    businessEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid business email'],
    },
    businessPhone: { type: String, required: true, match: [/^[0-9]{10,15}$/, 'Invalid phone number'] },
    gstNumber: { type: String, trim: true, uppercase: true, maxlength: 20 },
    address: { type: String, required: true, trim: true, maxlength: 300 },
    logoUrl: { type: String, default: '' },
    description: { type: String, default: '', maxlength: 1000 },
    commissionRate: { type: Number, min: 0, max: 100, default: 10 },
    approvalStatus: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING', index: true },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    isBlocked: { type: Boolean, default: false, index: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

vendorSchema.plugin(softDeletePlugin);
vendorSchema.plugin(mongoosePaginate);

vendorSchema.index({ storeName: 'text', description: 'text' });

vendorSchema.virtual('isApproved').get(function isApproved() {
  return this.approvalStatus === 'APPROVED';
});

export const Vendor = mongoose.model('Vendor', vendorSchema);
