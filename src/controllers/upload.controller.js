import { uploadService } from '../services/upload.service.js';
import { productService } from '../services/product.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../config/logger.js';

/**
 * Upload single product image
 * POST /api/v1/products/upload
 */
export const uploadProductImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'No file provided');
  }

  const { buffer, mimetype, originalname } = req.file;
  const vendorId = req.user._id;

  // Upload file using service
  const uploadResult = await uploadService.uploadFile({
    buffer,
    mimeType: mimetype,
    vendorId: vendorId.toString(),
    folder: 'products',
  });

  res.status(201).json(
    new ApiResponse(201, 'Image uploaded successfully', {
      url: uploadResult.url,
      filename: uploadResult.filename,
      originalName: originalname,
    })
  );
});

/**
 * Upload multiple product images
 * POST /api/v1/products/upload-multiple
 */
export const uploadProductImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(400, 'No files provided');
  }

  const vendorId = req.user._id.toString();
  const uploadedImages = [];
  const failures = [];

  // Upload each file
  for (const file of req.files) {
    try {
      const uploadResult = await uploadService.uploadFile({
        buffer: file.buffer,
        mimeType: file.mimetype,
        vendorId,
        folder: 'products',
      });

      uploadedImages.push({
        url: uploadResult.url,
        filename: uploadResult.filename,
        originalName: file.originalname,
      });
    } catch (error) {
      failures.push({
        originalName: file.originalname,
        error: error.message,
      });

      logger.error(`Failed to upload image ${file.originalname}: ${error.message}`);
    }
  }

  res.status(201).json(
    new ApiResponse(201, 'Images uploaded', {
      uploaded: uploadedImages,
      failed: failures,
      totalUploaded: uploadedImages.length,
      totalFailed: failures.length,
    })
  );
});

/**
 * Delete product image
 * DELETE /api/v1/products/:productId/images/:filename
 * Verifies vendor ownership before deletion
 */
export const deleteProductImage = asyncHandler(async (req, res) => {
  const { productId, filename } = req.params;
  const vendorId = req.user._id;

  // Verify product exists and belongs to vendor
  const product = await productService.getProductById(productId);
  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  if (product.vendor.toString() !== vendorId.toString()) {
    throw new ApiError(403, 'Not authorized to delete this product image');
  }

  // Delete file from storage
  await uploadService.deleteFile(vendorId.toString(), filename, 'products');

  // Remove image from product document
  product.images = product.images.filter((img) => img.filename !== filename);
  await product.save();

  res.status(200).json(new ApiResponse(200, 'Image deleted successfully'));
});

/**
 * Get default/fallback image
 * Useful for products without images
 */
export const getDefaultImage = asyncHandler(async (req, res) => {
  // In production, you might return a placeholder image or a 404
  throw new ApiError(404, 'No image available');
});
