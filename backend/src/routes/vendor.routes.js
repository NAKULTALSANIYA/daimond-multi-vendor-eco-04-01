import { Router } from 'express';
import {
  searchVendors,
  vendorDashboard,
  vendorProfile,
  vendorSalesAnalytics,
  updateVendorProfile,
} from '../controllers/vendor.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRoles } from '../middlewares/rbac.middleware.js';
import { ROLES } from '../constants/roles.js';

const router = Router();

router.get('/', searchVendors);
router.get('/me', authMiddleware, requireRoles(ROLES.VENDOR), vendorProfile);
router.patch('/me', authMiddleware, requireRoles(ROLES.VENDOR), updateVendorProfile);
router.get('/dashboard', authMiddleware, requireRoles(ROLES.VENDOR), vendorDashboard);
router.get('/analytics', authMiddleware, requireRoles(ROLES.VENDOR), vendorSalesAnalytics);

export default router;
