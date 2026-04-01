import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { softDeletePlugin } from './plugins/softDelete.plugin.js';

const addressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fullName: { type: String, required: true, trim: true, maxlength: 80 },
    phone: { type: String, required: true, match: [/^[0-9]{10,15}$/, 'Invalid phone number'] },
    line1: { type: String, required: true, trim: true, maxlength: 200 },
    line2: { type: String, trim: true, maxlength: 200 },
    city: { type: String, required: true, trim: true, maxlength: 80 },
    state: { type: String, required: true, trim: true, maxlength: 80 },
    country: { type: String, required: true, trim: true, maxlength: 80 },
    postalCode: { type: String, required: true, trim: true, match: [/^[0-9A-Za-z -]{4,12}$/, 'Invalid postal code'] },
    label: { type: String, enum: ['HOME', 'WORK', 'OTHER'], default: 'HOME' },
    isDefault: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

addressSchema.plugin(softDeletePlugin);
addressSchema.plugin(mongoosePaginate);

addressSchema.index({ user: 1, isDefault: 1 });

export const Address = mongoose.model('Address', addressSchema);
