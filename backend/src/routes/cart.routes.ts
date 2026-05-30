import { Router } from 'express';
import { cartController } from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { cartItemSchema, updateCartSchema, idParamSchema } from '../utils/validation';

const router = Router();

router.use(authenticate);

router.get('/', cartController.getCart);
router.post('/', validate(cartItemSchema), cartController.addItem);
router.put('/:id', validate(updateCartSchema), cartController.updateQuantity);
router.delete('/:id', validate(idParamSchema), cartController.removeItem);

export default router;
