import { userService } from '../services/user.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const profile = asyncHandler(async (req, res) => {
  const user = await userService.profile(req.user._id);
  res.status(200).json(new ApiResponse(200, 'Profile fetched', user));
});

export const listAddresses = asyncHandler(async (req, res) => {
  const result = await userService.listAddresses(req.user._id, req.query);
  res.status(200).json(new ApiResponse(200, 'Addresses fetched', result.docs, {
    page: result.page,
    totalPages: result.totalPages,
    totalDocs: result.totalDocs,
  }));
});

export const addAddress = asyncHandler(async (req, res) => {
  const address = await userService.addAddress(req.user._id, req.validated.body);
  res.status(201).json(new ApiResponse(201, 'Address created', address));
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const wishlist = await userService.toggleWishlist(req.user._id, req.params.productId);
  res.status(200).json(new ApiResponse(200, 'Wishlist updated', wishlist));
});
