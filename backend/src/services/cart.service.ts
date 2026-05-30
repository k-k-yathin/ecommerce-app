import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/error.middleware';

export const cartService = {
  async getCart(userId: string) {
    const items = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
      orderBy: { id: 'asc' },
    });

    const total = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    return { items, total, itemCount: items.reduce((sum, i) => sum + i.quantity, 0) };
  },

  async addItem(userId: string, productId: string, quantity: number) {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    if (product.stock < quantity) {
      throw new AppError('Insufficient stock', 400);
    }

    const existing = await prisma.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) {
      const newQty = existing.quantity + quantity;
      if (product.stock < newQty) {
        throw new AppError('Insufficient stock', 400);
      }
      return prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQty },
        include: { product: true },
      });
    }

    return prisma.cartItem.create({
      data: { userId, productId, quantity },
      include: { product: true },
    });
  },

  async updateQuantity(userId: string, itemId: string, quantity: number) {
    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, userId },
      include: { product: true },
    });
    if (!item) {
      throw new AppError('Cart item not found', 404);
    }
    if (item.product.stock < quantity) {
      throw new AppError('Insufficient stock', 400);
    }

    return prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
      include: { product: true },
    });
  },

  async removeItem(userId: string, itemId: string) {
    const item = await prisma.cartItem.findFirst({
      where: { id: itemId, userId },
    });
    if (!item) {
      throw new AppError('Cart item not found', 404);
    }

    await prisma.cartItem.delete({ where: { id: itemId } });
    return { message: 'Item removed from cart' };
  },

  async clearCart(userId: string) {
    await prisma.cartItem.deleteMany({ where: { userId } });
  },
};
