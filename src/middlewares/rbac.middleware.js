import { ApiError } from '../utils/ApiError.js';

export const requireRoles = (...roles) => (req, _res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Unauthorized'));
  }

  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, 'Forbidden: insufficient permissions'));
  }

  return next();
};
