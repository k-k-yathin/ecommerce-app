import { Prisma } from '@prisma/client';
import { prisma } from '../utils/prisma';
import { AppError } from '../middleware/error.middleware';

interface ProductQuery {
  search?: string;
  category?: string;
  sort?: string;
  page?: string;
  limit?: string;
  minPrice?: string;
  maxPrice?: string;
}

export const productService = {
  async getAll(query: ProductQuery) {
    const page = Math.max(1, parseInt(query.page || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(query.limit || '12', 10)));
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.category) {
      where.category = { equals: query.category, mode: 'insensitive' };
    }

    if (query.minPrice || query.maxPrice) {
      where.price = {};
      if (query.minPrice) where.price.gte = parseFloat(query.minPrice);
      if (query.maxPrice) where.price.lte = parseFloat(query.maxPrice);
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    switch (query.sort) {
      case 'price_asc':
        orderBy = { price: 'asc' };
        break;
      case 'price_desc':
        orderBy = { price: 'desc' };
        break;
      case 'title_asc':
        orderBy = { title: 'asc' };
        break;
      case 'title_desc':
        orderBy = { title: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, orderBy, skip, take: limit }),
      prisma.product.count({ where }),
    ]);

    const categories = await prisma.product.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      categories: categories.map((c) => c.category),
    };
  },

  async getById(id: string) {
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new AppError('Product not found', 404);
    }
    return product;
  },

  async create(data: {
    title: string;
    description: string;
    price: number;
    image: string;
    stock: number;
    category: string;
  }) {
    return prisma.product.create({ data });
  },

  async update(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      price: number;
      image: string;
      stock: number;
      category: string;
    }>
  ) {
    await productService.getById(id);
    return prisma.product.update({ where: { id }, data });
  },

  async delete(id: string) {
    await productService.getById(id);
    await prisma.product.delete({ where: { id } });
    return { message: 'Product deleted successfully' };
  },
};
