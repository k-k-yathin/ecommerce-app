import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/product.service';

export const productController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.getAll(req.query as Record<string, string>);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getById(req.params.id);
      res.json(product);
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.create(req.body);
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.update(req.params.id, req.body);
      res.json(product);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.delete(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};
