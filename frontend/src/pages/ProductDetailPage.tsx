import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productApi } from '../services/product.service';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;
    productApi
      .getById(id)
      .then(({ data }) => setProduct(data))
      .catch(() => setError('Product not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      setMessage('Please login to add items to cart');
      return;
    }
    if (!product) return;

    setAdding(true);
    setMessage('');
    try {
      await addToCart(product.id, quantity);
      setMessage('Added to cart!');
    } catch {
      setMessage('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <ErrorMessage message={error || 'Product not found'} />
        <div className="mt-4 text-center">
          <Link to="/products" className="text-primary-600 hover:underline">
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-gray-500">
        <Link to="/" className="hover:text-primary-600">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:text-primary-600">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.title}</span>
      </nav>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid gap-10 lg:grid-cols-2"
      >
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
          <img
            src={product.image}
            alt={product.title}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div>
          <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-700">
            {product.category}
          </span>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">{product.title}</h1>
          <p className="mt-4 text-3xl font-bold text-primary-600">
            ${product.price.toFixed(2)}
          </p>
          <p className="mt-6 leading-relaxed text-gray-600">{product.description}</p>

          <div className="mt-6 flex items-center gap-4">
            <span
              className={`text-sm font-medium ${
                product.stock > 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          {product.stock > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <div className="flex items-center rounded-xl border border-gray-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-gray-600 hover:bg-gray-50"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="px-4 py-3 text-gray-600 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="flex-1 rounded-xl bg-primary-600 px-8 py-3.5 font-semibold text-white transition hover:bg-primary-700 disabled:opacity-50 sm:flex-none"
              >
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          )}

          {message && (
            <p
              className={`mt-4 text-sm ${
                message.includes('Added') ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {message}
              {message.includes('login') && (
                <Link to="/login" className="ml-1 font-medium underline">
                  Login here
                </Link>
              )}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
