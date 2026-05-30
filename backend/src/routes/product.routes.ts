import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  productSchema,
  productQuerySchema,
  idParamSchema,
} from '../utils/validation';

const router = Router();

router.get('/', validate(productQuerySchema), productController.getAll);
router.get('/:id', validate(idParamSchema), productController.getById);

router.post(
  '/',
  authenticate,
  authorizeAdmin,
  validate(productSchema),
  productController.create
);
router.put(
  '/:id',
  authenticate,
  authorizeAdmin,
  validate(idParamSchema),
  productController.update
);
router.delete(
  '/:id',
  authenticate,
  authorizeAdmin,
  validate(idParamSchema),
  productController.delete
);

export default router;
