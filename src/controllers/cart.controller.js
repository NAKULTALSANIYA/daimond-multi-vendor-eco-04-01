import { cartService } from '../services/cart.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user._id);
  res.status(200).json(new ApiResponse(200, 'Cart fetched', cart));
});

export const addToCart = asyncHandler(async (req, res) => {
  const cart = await cartService.addToCart(req.user._id, req.validated.body.productId, req.validated.body.quantity);
  res.status(200).json(new ApiResponse(200, 'Item added to cart', cart));
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await cartService.removeFromCart(req.user._id, req.params.productId);
  res.status(200).json(new ApiResponse(200, 'Item removed from cart', cart));
});

export const clearCart = asyncHandler(async (req, res) => {
  await cartService.clearCart(req.user._id);
  res.status(200).json(new ApiResponse(200, 'Cart cleared'));
});
