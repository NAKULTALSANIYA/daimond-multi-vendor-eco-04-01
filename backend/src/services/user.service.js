import { Address } from '../models/Address.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { buildPagination } from '../utils/query.js';

export class UserService {
  async profile(userId) {
    const user = await User.findById(userId).select('-password').populate('wishlist', 'name price images stock');
    if (!user) throw new ApiError(404, 'User not found');
    return user;
  }

  async listAddresses(userId, query) {
    const { page, limit, sort } = buildPagination(query);
    return Address.paginate({ user: userId }, { page, limit, sort });
  }

  async addAddress(userId, payload) {
    if (payload.isDefault) {
      await Address.updateMany({ user: userId }, { isDefault: false });
    }
    return Address.create({ ...payload, user: userId });
  }

  async toggleWishlist(userId, productId) {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, 'User not found');

    const exists = user.wishlist.some((item) => item.toString() === productId);
    user.wishlist = exists ? user.wishlist.filter((item) => item.toString() !== productId) : [...user.wishlist, productId];
    await user.save();
    return user.wishlist;
  }
}

export const userService = new UserService();
