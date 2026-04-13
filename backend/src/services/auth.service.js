import { RefreshToken } from '../models/RefreshToken.js';
import { User } from '../models/User.js';
import { Vendor } from '../models/Vendor.js';
import { ApiError } from '../utils/ApiError.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/token.js';
import { durationToMs } from '../utils/time.js';

const buildAuthPayload = (user) => ({
  sub: user._id.toString(),
  role: user.role,
  email: user.email,
});

const createTokenPair = async (userId, payload, refreshTtlMs) => {
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  const tokenHash = RefreshToken.hashToken(refreshToken);

  await RefreshToken.create({
    user: userId,
    tokenHash,
    expiresAt: new Date(Date.now() + refreshTtlMs),
  });

  return { accessToken, refreshToken };
};

export class AuthService {
  async register(payload, defaultCommissionRate) {
    const existing = await User.findOne({ email: payload.email });
    if (existing) throw new ApiError(409, 'Email already exists');

    const role = payload.role || 'USER';
    const user = await User.create({
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role,
      phone: payload.phone,
    });

    if (role === 'VENDOR') {
      await Vendor.create({
        user: user._id,
        storeName: `${payload.name} Store`,
        businessEmail: payload.email,
        businessPhone: payload.phone || '9999999999',
        address: 'To be updated',
        commissionRate: defaultCommissionRate,
      });
    }

    const refreshTtlMs = durationToMs(process.env.JWT_REFRESH_EXPIRES_IN || '7d') || 7 * 24 * 3600 * 1000;
    const tokens = await createTokenPair(user._id, buildAuthPayload(user), refreshTtlMs);

    return { user, ...tokens };
  }

  async login(payload) {
    const lookup = payload.email
      ? { email: payload.email }
      : { phone: payload.phone };

    const user = await User.findOne(lookup).select('+password');
    if (!user) throw new ApiError(401, 'Invalid credentials');
    if (user.isBlocked || user.isDeleted) throw new ApiError(403, 'Account is blocked');

    const valid = await user.comparePassword(payload.password);
    if (!valid) throw new ApiError(401, 'Invalid credentials');

    user.lastLoginAt = new Date();
    await user.save();

    const refreshTtlMs = durationToMs(process.env.JWT_REFRESH_EXPIRES_IN || '7d') || 7 * 24 * 3600 * 1000;
    const tokens = await createTokenPair(user._id, buildAuthPayload(user), refreshTtlMs);
    user.password = undefined;

    return { user, ...tokens };
  }

  async refresh(refreshToken) {
    if (!refreshToken) throw new ApiError(401, 'Refresh token missing');

    const payload = verifyRefreshToken(refreshToken);
    const tokenHash = RefreshToken.hashToken(refreshToken);
    const tokenDoc = await RefreshToken.findOne({ tokenHash, user: payload.sub, revokedAt: null });

    if (!tokenDoc || tokenDoc.expiresAt.getTime() < Date.now()) {
      throw new ApiError(401, 'Refresh token invalid or expired');
    }

    tokenDoc.revokedAt = new Date();
    await tokenDoc.save();

    const user = await User.findById(payload.sub);
    if (!user) throw new ApiError(401, 'User not found');

    const refreshTtlMs = durationToMs(process.env.JWT_REFRESH_EXPIRES_IN || '7d') || 7 * 24 * 3600 * 1000;
    return createTokenPair(user._id, buildAuthPayload(user), refreshTtlMs);
  }

  async logout(refreshToken) {
    if (!refreshToken) throw new ApiError(401, 'Not logged in');

    const payload = verifyRefreshToken(refreshToken);
    const tokenHash = RefreshToken.hashToken(refreshToken);
    const tokenDoc = await RefreshToken.findOne({ tokenHash, user: payload.sub, revokedAt: null });

    if (!tokenDoc || tokenDoc.expiresAt.getTime() < Date.now()) {
      throw new ApiError(401, 'Not logged in');
    }

    tokenDoc.revokedAt = new Date();
    await tokenDoc.save();
  }
}

export const authService = new AuthService();
