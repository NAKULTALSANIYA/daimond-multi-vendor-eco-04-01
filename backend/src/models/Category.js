import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { softDeletePlugin } from './plugins/softDelete.plugin.js';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, minlength: 2, maxlength: 80, index: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: '', maxlength: 500 },
    order: { type: Number, default: 0, min: 0, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

categorySchema.plugin(softDeletePlugin);
categorySchema.plugin(mongoosePaginate);

export const Category = mongoose.model('Category', categorySchema);
