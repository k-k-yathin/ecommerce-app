import { Response, NextFunction } from 'express';
import { orderService } from '../services/order.service';
import { AuthRequest } from '../middleware/auth.middleware';

export const orderController = {
  async createOrder(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const order = await orderService.createOrder(req.user!.userId);
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  },

  async getUserOrders(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const orders = await orderService.getUserOrders(req.user!.userId);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  },

  async getOrderById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const isAdmin = req.user!.role === 'ADMIN';
      const order = await orderService.getOrderById(
        req.user!.userId,
        req.params.id,
        isAdmin
      );
      res.json(order);
    } catch (error) {
      next(error);
    }
  },

  async getAllOrders(_req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const orders = await orderService.getAllOrders();
      res.json(orders);
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const order = await orderService.updateStatus(req.params.id, req.body.status);
      res.json(order);
    } catch (error) {
      next(error);
    }
  },
};
