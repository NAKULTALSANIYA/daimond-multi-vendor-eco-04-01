import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { env } from '../config/env.js';
import { ROLES } from '../constants/roles.js';
import { softDeletePlugin } from './plugins/softDelete.plugin.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'],
      index: true,
    },
    password: { type: String, required: true, minlength: 8, select: false },
    phone: { type: String, trim: true, match: [/^[0-9]{10,15}$/, 'Invalid phone number'] },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.USER, index: true },
    avatarUrl: { type: String, default: '' },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    isBlocked: { type: Boolean, default: false, index: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.plugin(softDeletePlugin);
userSchema.plugin(mongoosePaginate);

userSchema.index({ name: 'text', email: 'text' });

userSchema.virtual('isVendor').get(function isVendor() {
  return this.role === ROLES.VENDOR;
});

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, env.bcryptSaltRounds);
  return next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model('User', userSchema);
