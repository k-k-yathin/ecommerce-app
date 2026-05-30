import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-lg"
    >
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute left-3 top-3 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white">
              Low Stock
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="rounded-full bg-red-600 px-3 py-1 text-sm font-semibold text-white">
                Out of Stock
              </span>
            </span>
          )}
        </div>
        <div className="p-4">
          <p className="mb-1 text-xs font-medium uppercase tracking-wide text-primary-600">
            {product.category}
          </p>
          <h3 className="mb-2 line-clamp-2 font-semibold text-gray-900 group-hover:text-primary-600">
            {product.title}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-xs text-gray-500">{product.stock} in stock</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
