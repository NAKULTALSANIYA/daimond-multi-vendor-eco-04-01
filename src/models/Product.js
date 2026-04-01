import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { softDeletePlugin } from './plugins/softDelete.plugin.js';

const productImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true, index: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 180 },
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    description: { type: String, required: true, maxlength: 3000 },
    price: { type: Number, required: true, min: 0, index: true },
    discountPrice: { type: Number, min: 0 },
    sku: { type: String, required: true, trim: true, uppercase: true, unique: true, index: true },
    stock: { type: Number, required: true, min: 0, default: 0, index: true },
    images: { type: [productImageSchema], default: [] },
    tags: { type: [String], default: [] },
    averageRating: { type: Number, min: 0, max: 5, default: 0 },
    totalReviews: { type: Number, min: 0, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.plugin(softDeletePlugin);
productSchema.plugin(mongoosePaginate);

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ vendor: 1, category: 1, price: 1 });
productSchema.index({ vendor: 1, stock: 1, isActive: 1 });

productSchema.virtual('isInStock').get(function isInStock() {
  return this.stock > 0;
});

productSchema.virtual('effectivePrice').get(function effectivePrice() {
  return this.discountPrice && this.discountPrice > 0 ? this.discountPrice : this.price;
});

productSchema.pre('save', function ensureDiscount(next) {
  if (this.discountPrice && this.discountPrice > this.price) {
    this.discountPrice = this.price;
  }
  next();
});

export const Product = mongoose.model('Product', productSchema);
