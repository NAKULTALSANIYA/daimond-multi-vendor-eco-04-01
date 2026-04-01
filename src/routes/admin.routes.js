import { Router } from 'express';
import {
  blockUser,
  blockVendor,
  createCategory,
  deleteCategory,
  listCategories,
  listOrders,
  listProducts,
  listUsers,
  listVendors,
  platformOverview,
  updateCategory,
  updateCommission,
  vendorDecision,
} from '../controllers/admin.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRoles } from '../middlewares/rbac.middleware.js';
import { ROLES } from '../constants/roles.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  blockStatusSchema,
  categorySchema,
  categoryUpdateSchema,
  commissionSchema,
  vendorDecisionSchema,
} from '../validators/admin.validator.js';

const router = Router();

router.use(authMiddleware, requireRoles(ROLES.ADMIN));

router.get('/overview', platformOverview);
router.get('/users', listUsers);
router.get('/vendors', listVendors);
router.get('/products', listProducts);
router.get('/orders', listOrders);

router.patch('/vendors/:vendorId/decision', validate(vendorDecisionSchema), vendorDecision);
router.patch('/users/:userId/block', validate(blockStatusSchema), blockUser);
router.patch('/vendors/:vendorId/block', validate(blockStatusSchema), blockVendor);
router.get('/categories', listCategories);
router.post('/categories', validate(categorySchema), createCategory);
router.patch('/categories/:categoryId', validate(categoryUpdateSchema), updateCategory);
router.delete('/categories/:categoryId', validate(categoryUpdateSchema), deleteCategory);
router.patch('/vendors/:vendorId/commission', validate(commissionSchema), updateCommission);

export default router;
