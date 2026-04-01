import { Router } from 'express';
import { addAddress, listAddresses, profile, toggleWishlist } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requireRoles } from '../middlewares/rbac.middleware.js';
import { ROLES } from '../constants/roles.js';
import { validate } from '../middlewares/validate.middleware.js';
import { addAddressSchema } from '../validators/user.validator.js';

const router = Router();

router.use(authMiddleware, requireRoles(ROLES.USER));

router.get('/profile', profile);
router.get('/addresses', listAddresses);
router.post('/addresses', validate(addAddressSchema), addAddress);
router.patch('/wishlist/:productId', toggleWishlist);

export default router;
