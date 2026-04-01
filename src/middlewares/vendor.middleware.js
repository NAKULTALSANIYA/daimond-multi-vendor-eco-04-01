import { Vendor } from '../models/Vendor.js';
import { ApiError } from '../utils/ApiError.js';

export const attachVendor = async (req, _res, next) => {
  const vendor = await Vendor.findOne({ user: req.user._id });
  if (!vendor) {
    return next(new ApiError(404, 'Vendor profile not found'));
  }
  if (vendor.isBlocked) {
    return next(new ApiError(403, 'Vendor is blocked'));
  }
  req.vendor = vendor;
  return next();
};
