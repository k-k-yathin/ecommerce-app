import { OrderStatus } from '@prisma/client';
import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/error.middleware';
import { cartService } from './cart.service';

export const orderService = {
  async createOrder(userId: string) {
    const cart = await cartService.getCart(userId);
    if (cart.items.length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for ${item.product.title}`, 400);
      }
    }

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          total: cart.total,
          userId,
          orderItems: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.product.price,
            })),
          },
        },
        include: {
          orderItems: { include: { product: true } },
        },
      });

      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cartItem.deleteMany({ where: { userId } });
      return newOrder;
    });

    return order;
  },

  async getUserOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        orderItems: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getOrderById(userId: string, orderId: string, isAdmin = false) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        orderItems: { include: { product: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }
    if (!isAdmin && order.userId !== userId) {
      throw new AppError('Access denied', 403);
    }

    return order;
  },

  async getAllOrders() {
    return prisma.order.findMany({
      include: {
        orderItems: { include: { product: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async updateStatus(orderId: string, status: OrderStatus) {
    await orderService.getOrderById('', orderId, true);
    return prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        orderItems: { include: { product: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });
  },
};
