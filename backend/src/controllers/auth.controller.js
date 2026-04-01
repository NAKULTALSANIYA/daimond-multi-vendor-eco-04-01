import { env } from '../config/env.js';
import { authService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const cookieConfig = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'strict',
};

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.validated.body, env.defaultCommissionRate);
  res.cookie('refreshToken', result.refreshToken, { ...cookieConfig, maxAge: 7 * 24 * 3600 * 1000 });
  res.status(201).json(new ApiResponse(201, 'User registered successfully', result));
});

export const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.validated.body);
  res.cookie('refreshToken', result.refreshToken, { ...cookieConfig, maxAge: 7 * 24 * 3600 * 1000 });
  res.status(200).json(new ApiResponse(200, 'Login successful', result));
});

export const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.validated.body.refreshToken || req.cookies?.refreshToken;
  const tokens = await authService.refresh(refreshToken);
  res.cookie('refreshToken', tokens.refreshToken, { ...cookieConfig, maxAge: 7 * 24 * 3600 * 1000 });
  res.status(200).json(new ApiResponse(200, 'Token refreshed', tokens));
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
  await authService.logout(refreshToken);
  res.clearCookie('refreshToken');
  res.status(200).json(new ApiResponse(200, 'Logged out successfully'));
});
