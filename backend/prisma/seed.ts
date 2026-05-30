import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 12);
  const userPassword = await bcrypt.hash('user123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@shop.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@shop.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@shop.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'user@shop.com',
      password: userPassword,
      role: 'USER',
    },
  });

  const products = [
    {
      title: 'Wireless Headphones',
      description:
        'Premium noise-cancelling wireless headphones with 30-hour battery life and crystal-clear audio quality.',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      stock: 50,
      category: 'Electronics',
    },
    {
      title: 'Smart Watch Pro',
      description:
        'Advanced fitness tracking smartwatch with heart rate monitor, GPS, and water resistance up to 50m.',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      stock: 30,
      category: 'Electronics',
    },
    {
      title: 'Classic Leather Jacket',
      description:
        'Handcrafted genuine leather jacket with premium stitching and timeless design.',
      price: 249.99,
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
      stock: 20,
      category: 'Fashion',
    },
    {
      title: 'Running Sneakers',
      description:
        'Lightweight performance running shoes with responsive cushioning and breathable mesh upper.',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
      stock: 75,
      category: 'Fashion',
    },
    {
      title: 'Minimalist Backpack',
      description:
        'Sleek water-resistant backpack with laptop compartment and organized interior pockets.',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
      stock: 40,
      category: 'Accessories',
    },
    {
      title: 'Ceramic Coffee Mug Set',
      description:
        'Set of 4 handcrafted ceramic mugs with modern geometric patterns. Dishwasher safe.',
      price: 34.99,
      image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500',
      stock: 100,
      category: 'Home',
    },
    {
      title: 'Yoga Mat Premium',
      description:
        'Extra thick eco-friendly yoga mat with non-slip surface and carrying strap included.',
      price: 49.99,
      image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500',
      stock: 60,
      category: 'Sports',
    },
    {
      title: 'Bluetooth Speaker',
      description:
        'Portable waterproof Bluetooth speaker with 360° sound and 12-hour playtime.',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
      stock: 45,
      category: 'Electronics',
    },
    {
      title: 'Organic Skincare Set',
      description:
        'Complete skincare routine with cleanser, toner, serum, and moisturizer. All organic ingredients.',
      price: 69.99,
      image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500',
      stock: 35,
      category: 'Beauty',
    },
    {
      title: 'Desk Lamp LED',
      description:
        'Adjustable LED desk lamp with touch controls, USB charging port, and eye-care technology.',
      price: 59.99,
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500',
      stock: 55,
      category: 'Home',
    },
    {
      title: 'Stainless Steel Water Bottle',
      description:
        'Insulated 32oz water bottle keeps drinks cold 24hrs or hot 12hrs. BPA-free.',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500',
      stock: 80,
      category: 'Sports',
    },
    {
      title: 'Polarized Sunglasses',
      description:
        'UV400 protection polarized sunglasses with lightweight titanium frame.',
      price: 119.99,
      image: 'https://images.unsplash.com/photo-1572635196233-14a0e7879e9c?w=500',
      stock: 25,
      category: 'Accessories',
    },
  ];

  const existingCount = await prisma.product.count();
  if (existingCount === 0) {
    await prisma.product.createMany({ data: products });
  }

  console.log('Seed completed!');
  console.log({ admin: admin.email, user: user.email });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
