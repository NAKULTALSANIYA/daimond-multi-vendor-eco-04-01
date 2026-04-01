import { Router } from 'express';
import adminRoutes from './admin.routes.js';
import authRoutes from './auth.routes.js';
import cartRoutes from './cart.routes.js';
import orderRoutes from './order.routes.js';
import productRoutes from './product.routes.js';
import userRoutes from './user.routes.js';
import vendorRoutes from './vendor.routes.js';
import uploadRoutes from './upload.routes.js';
import { listCategories } from '../controllers/admin.controller.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
// Public categories endpoint (no auth required)
router.get('/categories', listCategories);
router.use('/uploads', uploadRoutes);
router.use('/vendors', vendorRoutes);
router.use('/users', userRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);

export default router;
