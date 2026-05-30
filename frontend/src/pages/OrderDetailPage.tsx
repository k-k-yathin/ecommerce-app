import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { orderApi } from '../services/order.service';
import { Order } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const statusSteps = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const justOrdered = (location.state as { justOrdered?: boolean })?.justOrdered;

  useEffect(() => {
    if (!id) return;
    orderApi
      .getById(id)
      .then(({ data }) => setOrder(data))
      .catch(() => setError('Order not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16">
        <ErrorMessage message={error || 'Order not found'} />
      </div>
    );
  }

  const currentStep = statusSteps.indexOf(order.status);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {justOrdered && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-xl bg-green-50 p-4 text-center text-green-800"
        >
          Order placed successfully! Thank you for your purchase.
        </motion.div>
      )}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-gray-500">
            Placed on{' '}
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            statusColors[order.status]
          }`}
        >
          {order.status}
        </span>
      </div>

      {order.status !== 'CANCELLED' && (
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <h2 className="mb-4 font-semibold text-gray-900">Order Status</h2>
          <div className="flex items-center justify-between">
            {statusSteps.map((step, i) => (
              <div key={step} className="flex flex-1 flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    i <= currentStep
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {i + 1}
                </div>
                <span className="mt-2 text-xs text-gray-600">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        <div className="border-b border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900">Order Items</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {order.orderItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4">
              <img
                src={item.product.image}
                alt={item.product.title}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <Link
                  to={`/products/${item.product.id}`}
                  className="font-medium text-gray-900 hover:text-primary-600"
                >
                  {item.product.title}
                </Link>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
              <span className="font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 p-6">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-primary-600">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <Link to="/orders" className="text-sm text-primary-600 hover:underline">
          &larr; Back to orders
        </Link>
      </div>
    </div>
  );
}
