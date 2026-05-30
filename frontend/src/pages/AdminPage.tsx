import { useEffect, useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { productApi } from '../services/product.service';
import { orderApi } from '../services/order.service';
import { Product, Order, OrderStatus } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

type Tab = 'products' | 'orders';

const emptyProduct = {
  title: '',
  description: '',
  price: 0,
  image: '',
  stock: 0,
  category: '',
};

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [productsRes, ordersRes] = await Promise.all([
        productApi.getAll({ limit: 100 }),
        orderApi.getAllOrders(),
      ]);
      setProducts(productsRes.data.products);
      setOrders(ordersRes.data);
    } catch {
      setError('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateForm = () => {
    setEditingProduct(null);
    setFormData(emptyProduct);
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price,
      image: product.image,
      stock: product.stock,
      category: product.category,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingProduct) {
        await productApi.update(editingProduct.id, formData);
      } else {
        await productApi.create(formData);
      }
      setShowForm(false);
      await fetchData();
    } catch {
      setError('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productApi.delete(id);
      await fetchData();
    } catch {
      setError('Failed to delete product');
    }
  };

  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    try {
      await orderApi.updateStatus(orderId, status);
      await fetchData();
    } catch {
      setError('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-1 text-gray-600">Manage products and orders</p>
        </div>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} onRetry={fetchData} />
        </div>
      )}

      <div className="mb-6 flex gap-2">
        {(['products', 'orders'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
              tab === t
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'products' && (
        <div>
          <div className="mb-4 flex justify-end">
            <button
              onClick={openCreateForm}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700"
            >
              Add Product
            </button>
          </div>

          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
            >
              <h2 className="mb-4 text-lg font-semibold">
                {editingProduct ? 'Edit Product' : 'New Product'}
              </h2>
              <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                <input
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                />
                <input
                  placeholder="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={formData.price || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseFloat(e.target.value) })
                  }
                  required
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={formData.stock || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: parseInt(e.target.value, 10) })
                  }
                  required
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                />
                <input
                  placeholder="Image URL"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  required
                  className="col-span-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  rows={3}
                  className="col-span-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
                />
                <div className="col-span-full flex gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          <div className="overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-100 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-700">Product</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Category</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Price</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Stock</th>
                  <th className="px-4 py-3 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                        <span className="font-medium">{product.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{product.category}</td>
                    <td className="px-4 py-3">${product.price.toFixed(2)}</td>
                    <td className="px-4 py-3">{product.stock}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditForm(product)}
                          className="text-primary-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-900">
                    Order #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.user?.name} ({order.user?.email}) &middot;{' '}
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold">${order.total.toFixed(2)}</span>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusUpdate(order.id, e.target.value as OrderStatus)
                    }
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${statusColors[order.status]} border-0 focus:outline-none focus:ring-2 focus:ring-primary-500/20`}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {order.orderItems.map((item) => (
                  <span
                    key={item.id}
                    className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs text-gray-600"
                  >
                    {item.product.title} x{item.quantity}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {orders.length === 0 && (
            <p className="py-8 text-center text-gray-500">No orders yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
