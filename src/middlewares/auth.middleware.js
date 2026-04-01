import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { verifyAccessToken } from '../utils/token.js';

export const authMiddleware = async (req, _res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : req.cookies?.accessToken;

    if (!token) {
      throw new ApiError(401, 'Authentication token missing');
    }

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).select('-password');

    if (!user || user.isBlocked || user.isDeleted) {
      throw new ApiError(401, 'Invalid authentication context');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error.statusCode ? error : new ApiError(401, 'Unauthorized access'));
  }
};
