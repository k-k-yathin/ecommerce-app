import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { orderApi } from '../services/order.service';
import LoadingSpinner from '../components/LoadingSpinner';
import { EmptyState } from '../components/Pagination';

export default function CartPage() {
  const { cart, loading, updateQuantity, removeFromCart } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCheckout = async () => {
    setCheckingOut(true);
    setError('');
    try {
      const { data } = await orderApi.create();
      navigate(`/orders/${data.id}`, { state: { justOrdered: true } });
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || 'Checkout failed';
      setError(message);
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900">Shopping Cart</h1>
        <EmptyState
          title="Your cart is empty"
          description="Looks like you haven't added anything to your cart yet."
          actionLabel="Start Shopping"
          actionTo="/products"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">Shopping Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cart.items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100"
            >
              <Link to={`/products/${item.product.id}`}>
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="h-24 w-24 rounded-xl object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link
                    to={`/products/${item.product.id}`}
                    className="font-semibold text-gray-900 hover:text-primary-600"
                  >
                    {item.product.title}
                  </Link>
                  <p className="text-sm text-gray-500">{item.product.category}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-lg border border-gray-200">
                    <button
                      onClick={() =>
                        item.quantity > 1
                          ? updateQuantity(item.id, item.quantity - 1)
                          : removeFromCart(item.id)
                      }
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          Math.min(item.product.stock, item.quantity + 1)
                        )
                      }
                      className="px-3 py-1.5 text-gray-600 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="self-start rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                aria-label="Remove item"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          ))}
        </div>

        <div className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Order Summary</h2>
          <div className="space-y-3 border-b border-gray-100 pb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal ({cart.itemCount} items)</span>
              <span className="font-medium">${cart.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-green-600">Free</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-bold text-primary-600">
              ${cart.total.toFixed(2)}
            </span>
          </div>
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
          <button
            onClick={handleCheckout}
            disabled={checkingOut}
            className="mt-6 w-full rounded-xl bg-primary-600 py-3.5 font-semibold text-white transition hover:bg-primary-700 disabled:opacity-50"
          >
            {checkingOut ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
