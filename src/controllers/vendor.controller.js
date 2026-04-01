import { Vendor } from '../models/Vendor.js';
import { vendorService } from '../services/vendor.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const injectVendor = asyncHandler(async (req, _res, next) => {
  const vendor = await Vendor.findOne({ user: req.user._id });
  req.vendor = vendor;
  next();
});

export const vendorProfile = asyncHandler(async (req, res) => {
  const vendor = await vendorService.getByUserId(req.user._id);
  res.status(200).json(new ApiResponse(200, 'Vendor profile fetched', vendor));
});

export const updateVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await vendorService.updateProfile(req.user._id, req.body);
  res.status(200).json(new ApiResponse(200, 'Vendor profile updated', vendor));
});

export const vendorDashboard = asyncHandler(async (req, res) => {
  const dashboard = await vendorService.dashboard(req.user._id);
  res.status(200).json(new ApiResponse(200, 'Vendor dashboard fetched', dashboard));
});

export const vendorSalesAnalytics = asyncHandler(async (req, res) => {
  const analytics = await vendorService.salesAnalytics(req.user._id);
  res.status(200).json(new ApiResponse(200, 'Vendor analytics fetched', analytics));
});

export const searchVendors = asyncHandler(async (req, res) => {
  const result = await vendorService.searchVendors(req.query);
  res.status(200).json(
    new ApiResponse(200, 'Vendors fetched', result.docs, {
      page: result.page,
      totalPages: result.totalPages,
      totalDocs: result.totalDocs,
    })
  );
});
