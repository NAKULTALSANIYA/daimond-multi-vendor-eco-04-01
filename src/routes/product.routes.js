import { Router } from 'express';
import {
  createProduct,
  deleteProduct,
  searchProducts,
  updateProduct,
  vendorProducts,
} from '../controllers/product.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRoles } from '../middlewares/rbac.middleware.js';
import { ROLES } from '../constants/roles.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createProductSchema, updateProductSchema } from '../validators/product.validator.js';
import { upload } from '../middlewares/upload.middleware.js';
import { attachVendor } from '../middlewares/vendor.middleware.js';

const router = Router();

router.get('/', searchProducts);

router.get('/vendor/my-products', authMiddleware, requireRoles(ROLES.VENDOR), attachVendor, vendorProducts);
router.post('/vendor', authMiddleware, requireRoles(ROLES.VENDOR), attachVendor, upload.single('image'), validate(createProductSchema), createProduct);
router.patch('/vendor/:productId', authMiddleware, requireRoles(ROLES.VENDOR), attachVendor, upload.single('image'), validate(updateProductSchema), updateProduct);
router.delete('/vendor/:productId', authMiddleware, requireRoles(ROLES.VENDOR), attachVendor, deleteProduct);

export default router;
