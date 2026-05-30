import { Response, NextFunction } from 'express';
import { cartService } from '../services/cart.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const cartController = {
  async getCart(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const cart = await cartService.getCart(req.user!.userId);
      res.json(cart);
    } catch (error) {
      next(error);
    }
  },

  async addItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { productId, quantity } = req.body;
      const item = await cartService.addItem(req.user!.userId, productId, quantity);
      res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  },

  async updateQuantity(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const item = await cartService.updateQuantity(
        req.user!.userId,
        req.params.id,
        req.body.quantity
      );
      res.json(item);
    } catch (error) {
      next(error);
    }
  },

  async removeItem(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await cartService.removeItem(req.user!.userId, req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};
