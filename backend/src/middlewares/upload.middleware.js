import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

// Use memory storage - file handling delegated to upload service
const storage = multer.memoryStorage();

// Allowed MIME types
const ALLOWED_TYPES = {
  'image/jpeg': true,
  'image/png': true,
  'image/webp': true,
};

/**
 * File filter for image uploads
 * Only allows jpeg, png, webp
 */
const fileFilter = (_req, file, cb) => {
  if (!ALLOWED_TYPES[file.mimetype]) {
    return cb(new ApiError(415, `File type not allowed. Allowed types: jpeg, png, webp`));
  }
  cb(null, true);
};

/**
 * Single file upload middleware
 * Usage: upload.single('image')
 */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});
