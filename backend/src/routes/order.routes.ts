import { Router } from 'express';
import { orderController } from '../controllers/order.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { orderStatusSchema, idParamSchema } from '../utils/validation';

const router = Router();

router.use(authenticate);

router.get('/admin/all', authorizeAdmin, orderController.getAllOrders);
router.post('/', orderController.createOrder);
router.get('/', orderController.getUserOrders);
router.patch(
  '/:id/status',
  authorizeAdmin,
  validate(orderStatusSchema),
  orderController.updateStatus
);
router.get('/:id', validate(idParamSchema), orderController.getOrderById);

export default router;
