import crypto from 'crypto';
import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true, index: true },
    revokedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

refreshTokenSchema.statics.hashToken = function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
};

export const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
