import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../config/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '../../uploads');

// Allowed MIME types and extensions
const ALLOWED_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Generate unique filename using timestamp + crypto
 * @param {string} originalExtension - File extension (.jpg, .png, etc)
 * @returns {string} - Unique filename
 */
const generateUniqueFilename = (originalExtension) => {
  const timestamp = Date.now();
  const random = crypto.randomBytes(4).toString('hex');
  return `${timestamp}-${random}${originalExtension}`;
};

/**
 * Validate file properties
 * @param {Buffer} buffer - File buffer
 * @param {string} mimeType - MIME type
 * @throws {ApiError} - If validation fails
 */
const validateFile = (buffer, mimeType) => {
  if (!buffer || buffer.length === 0) {
    throw new ApiError(400, 'File buffer is empty');
  }

  if (buffer.length > MAX_FILE_SIZE) {
    throw new ApiError(413, `File size exceeds 5MB limit (received ${(buffer.length / 1024 / 1024).toFixed(2)}MB)`);
  }

  if (!ALLOWED_TYPES[mimeType]) {
    throw new ApiError(415, `File type not allowed. Allowed types: ${Object.keys(ALLOWED_TYPES).join(', ')}`);
  }
};

/**
 * Create vendor upload directory structure
 * @param {string} vendorId - Vendor ID
 * @param {string} folder - Subfolder (products, profile, etc)
 * @returns {Promise<string>} - Full directory path
 */
const ensureVendorDirectory = async (vendorId, folder) => {
  const vendorPath = path.join(uploadsDir, 'vendors', vendorId, folder);
  try {
    await fs.mkdir(vendorPath, { recursive: true });
    return vendorPath;
  } catch (error) {
    logger.error(`Failed to create vendor directory: ${error.message}`);
    throw new ApiError(500, 'Failed to create upload directory');
  }
};

/**
 * Upload file to local storage
 * @param {Object} options - Upload options
 * @param {Buffer} options.buffer - File buffer from multer
 * @param {string} options.mimeType - MIME type
 * @param {string} options.vendorId - Vendor ID
 * @param {string} options.folder - Subfolder (default: products)
 * @returns {Promise<Object>} - { url, filename }
 * @throws {ApiError} - If upload fails
 */
export const uploadFile = async ({ buffer, mimeType, vendorId, folder = 'products' }) => {
  try {
    // Validate input
    if (!vendorId) {
      throw new ApiError(400, 'Vendor ID is required');
    }

    // Validate file
    validateFile(buffer, mimeType);

    // Ensure directory exists
    const vendorPath = await ensureVendorDirectory(vendorId, folder);

    // Generate unique filename
    const extension = ALLOWED_TYPES[mimeType];
    const filename = generateUniqueFilename(`.${extension}`);
    const filePath = path.join(vendorPath, filename);

    // Write file to disk
    await fs.writeFile(filePath, buffer);

    // Return accessible URL and filename
    const url = `/uploads/vendors/${vendorId}/${folder}/${filename}`;

    logger.info(`File uploaded: ${url}`);

    return { url, filename };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error(`Upload error: ${error.message}`);
    throw new ApiError(500, 'Failed to upload file');
  }
};

/**
 * Delete file from storage
 * @param {string} vendorId - Vendor ID
 * @param {string} filename - Filename to delete
 * @param {string} folder - Subfolder (default: products)
 * @returns {Promise<boolean>} - Success status
 */
export const deleteFile = async (vendorId, filename, folder = 'products') => {
  try {
    if (!vendorId || !filename) {
      throw new ApiError(400, 'Vendor ID and filename are required');
    }

    const filePath = path.join(uploadsDir, 'vendors', vendorId, folder, filename);

    // Security: Prevent directory traversal attacks
    const vendorPath = path.join(uploadsDir, 'vendors', vendorId);
    const resolvedPath = path.resolve(filePath);
    const resolvedVendorPath = path.resolve(vendorPath);

    if (!resolvedPath.startsWith(resolvedVendorPath)) {
      throw new ApiError(403, 'Invalid file path');
    }

    // Check if file exists before attempting deletion
    try {
      await fs.access(filePath);
    } catch {
      logger.warn(`File not found: ${filePath}`);
      return true; // Don't throw error if file doesn't exist
    }

    // Delete file
    await fs.unlink(filePath);
    logger.info(`File deleted: ${filePath}`);

    return true;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    logger.error(`Delete error: ${error.message}`);
    throw new ApiError(500, 'Failed to delete file');
  }
};

/**
 * Delete multiple files
 * @param {string} vendorId - Vendor ID
 * @param {Array<string>} filenames - Array of filenames to delete
 * @param {string} folder - Subfolder (default: products)
 * @returns {Promise<Object>} - { deleted: number, failed: number }
 */
export const deleteFiles = async (vendorId, filenames, folder = 'products') => {
  let deleted = 0;
  let failed = 0;

  for (const filename of filenames) {
    try {
      await deleteFile(vendorId, filename, folder);
      deleted += 1;
    } catch (error) {
      logger.error(`Failed to delete file ${filename}: ${error.message}`);
      failed += 1;
    }
  }

  return { deleted, failed };
};

/**
 * Get file stats (for validation before delete, etc)
 * @param {string} vendorId - Vendor ID
 * @param {string} filename - Filename
 * @param {string} folder - Subfolder (default: products)
 * @returns {Promise<Object|null>} - File stats or null if not found
 */
export const getFileStats = async (vendorId, filename, folder = 'products') => {
  try {
    const filePath = path.join(uploadsDir, 'vendors', vendorId, folder, filename);
    const stats = await fs.stat(filePath);
    return stats;
  } catch (error) {
    return null;
  }
};

export const uploadService = {
  uploadFile,
  deleteFile,
  deleteFiles,
  getFileStats,
};
