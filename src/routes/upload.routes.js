import { Router } from 'express';
import { uploadProductImage, uploadProductImages, deleteProductImage } from '../controllers/upload.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRoles } from '../middlewares/rbac.middleware.js';
import { ROLES } from '../constants/roles.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

/**
 * All routes require vendor authentication
 */
router.use(authMiddleware, requireRoles(ROLES.VENDOR));

/**
 * POST /api/v1/uploads/single
 * Upload single product image
 */
router.post('/single', upload.single('image'), uploadProductImage);

/**
 * POST /api/v1/uploads/multiple
 * Upload multiple product images (max 5)
 */
router.post('/multiple', upload.array('images', 5), uploadProductImages);

/**
 * DELETE /api/v1/uploads/:productId/:filename
 * Delete product image (verifies vendor ownership)
 */
router.delete('/:productId/:filename', deleteProductImage);

export default router;
