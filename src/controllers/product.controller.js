import { productService } from '../services/product.service.js';
import { uploadService } from '../services/upload.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const searchProducts = asyncHandler(async (req, res) => {
  const result = await productService.searchProducts(req.query);
  res.status(200).json(new ApiResponse(200, 'Products fetched', result.docs, {
    page: result.page,
    totalPages: result.totalPages,
    totalDocs: result.totalDocs,
  }));
});

export const vendorProducts = asyncHandler(async (req, res) => {
  const result = await productService.vendorProducts(req.vendor._id, req.query);
  res.status(200).json(new ApiResponse(200, 'Vendor products fetched', result.docs, {
    page: result.page,
    totalPages: result.totalPages,
    totalDocs: result.totalDocs,
  }));
});

export const createProduct = asyncHandler(async (req, res) => {
  const payload = { ...req.validated.body };

  if (req.file) {
    const uploadResult = await uploadService.uploadFile({
      buffer: req.file.buffer,
      mimeType: req.file.mimetype,
      vendorId: req.vendor._id.toString(),
      folder: 'products',
    });

    payload.images = [
      {
        url: uploadResult.url,
        publicId: uploadResult.filename,
      },
    ];
  }

  const product = await productService.createProduct(req.vendor._id, payload);
  res.status(201).json(new ApiResponse(201, 'Product created', product));
});

export const updateProduct = asyncHandler(async (req, res) => {
  const payload = { ...req.validated.body };

  if (req.file) {
    const uploadResult = await uploadService.uploadFile({
      buffer: req.file.buffer,
      mimeType: req.file.mimetype,
      vendorId: req.vendor._id.toString(),
      folder: 'products',
    });

    payload.images = [
      {
        url: uploadResult.url,
        publicId: uploadResult.filename,
      },
    ];
  }

  const product = await productService.updateProduct(req.vendor._id, req.params.productId, payload);
  res.status(200).json(new ApiResponse(200, 'Product updated', product));
});

export const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.vendor._id, req.params.productId);
  res.status(200).json(new ApiResponse(200, 'Product deleted'));
});
