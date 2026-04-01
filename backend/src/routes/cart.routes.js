import { Router } from 'express';
import { addToCart, clearCart, getCart, removeFromCart } from '../controllers/cart.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRoles } from '../middlewares/rbac.middleware.js';
import { ROLES } from '../constants/roles.js';
import { validate } from '../middlewares/validate.middleware.js';
import { addToCartSchema } from '../validators/cart.validator.js';

const router = Router();

router.use(authMiddleware, requireRoles(ROLES.USER));
router.get('/', getCart);
router.post('/', validate(addToCartSchema), addToCart);
router.delete('/:productId', removeFromCart);
router.delete('/', clearCart);

export default router;
