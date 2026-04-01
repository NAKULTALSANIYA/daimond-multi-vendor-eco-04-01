import { adminService } from '../services/admin.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const platformOverview = asyncHandler(async (_req, res) => {
  const overview = await adminService.platformOverview();
  res.status(200).json(new ApiResponse(200, 'Platform overview fetched', overview));
});

export const listUsers = asyncHandler(async (req, res) => {
  const result = await adminService.listUsers(req.query);
  res.status(200).json(new ApiResponse(200, 'Users fetched', result.docs, {
    page: result.page,
    totalPages: result.totalPages,
    totalDocs: result.totalDocs,
  }));
});

export const listVendors = asyncHandler(async (req, res) => {
  const result = await adminService.listVendors(req.query);
  res.status(200).json(new ApiResponse(200, 'Vendors fetched', result.docs, {
    page: result.page,
    totalPages: result.totalPages,
    totalDocs: result.totalDocs,
  }));
});

export const listProducts = asyncHandler(async (req, res) => {
  const result = await adminService.listProducts(req.query);
  res.status(200).json(new ApiResponse(200, 'Products fetched', result.docs, {
    page: result.page,
    totalPages: result.totalPages,
    totalDocs: result.totalDocs,
  }));
});

export const listOrders = asyncHandler(async (req, res) => {
  const result = await adminService.listOrders(req.query);
  res.status(200).json(new ApiResponse(200, 'Orders fetched', result.docs, {
    page: result.page,
    totalPages: result.totalPages,
    totalDocs: result.totalDocs,
  }));
});

export const vendorDecision = asyncHandler(async (req, res) => {
  const vendor = await adminService.approveVendor(req.params.vendorId, req.user._id, req.validated.body.decision);
  res.status(200).json(new ApiResponse(200, 'Vendor decision applied', vendor));
});

export const blockUser = asyncHandler(async (req, res) => {
  const user = await adminService.blockUser(req.params.userId, req.validated.body.isBlocked);
  res.status(200).json(new ApiResponse(200, 'User status updated', user));
});

export const blockVendor = asyncHandler(async (req, res) => {
  const vendor = await adminService.blockVendor(req.params.vendorId, req.validated.body.isBlocked);
  res.status(200).json(new ApiResponse(200, 'Vendor status updated', vendor));
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await adminService.createCategory(req.validated.body);
  res.status(201).json(new ApiResponse(201, 'Category created', category));
});

export const listCategories = asyncHandler(async (req, res) => {
  const result = await adminService.listCategories(req.query);
  res.status(200).json(
    new ApiResponse(200, 'Categories fetched', result.docs, {
      page: result.page,
      totalPages: result.totalPages,
      totalDocs: result.totalDocs,
    })
  );
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await adminService.updateCategory(req.params.categoryId, req.validated.body);
  res.status(200).json(new ApiResponse(200, 'Category updated', category));
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await adminService.deleteCategory(req.params.categoryId);
  res.status(200).json(new ApiResponse(200, 'Category deleted'));
});

export const updateCommission = asyncHandler(async (req, res) => {
  const vendor = await adminService.updateCommission(req.params.vendorId, req.validated.body.commissionRate);
  res.status(200).json(new ApiResponse(200, 'Commission updated', vendor));
});
