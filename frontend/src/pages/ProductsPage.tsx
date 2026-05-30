import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import Pagination from '../components/Pagination';
import { productApi } from '../services/product.service';
import { Product } from '../types';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await productApi.getAll({
        search: search || undefined,
        category: category || undefined,
        sort,
        page,
        limit: 12,
      });
      setProducts(data.products);
      setCategories(data.categories);
      setTotalPages(data.pagination.totalPages);
    } catch {
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== 'page') params.delete('page');
    setSearchParams(params);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
        <p className="mt-2 text-gray-600">Browse our complete collection</p>
      </div>

      <div className="mb-8 flex flex-col gap-4 lg:flex-row">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search products..."
            defaultValue={search}
            onChange={(e) => {
              const val = e.target.value;
              clearTimeout((window as unknown as { searchTimeout: number }).searchTimeout);
              (window as unknown as { searchTimeout: number }).searchTimeout = window.setTimeout(
                () => updateParam('search', val),
                400
              );
            }}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>
        <select
          value={category}
          onChange={(e) => updateParam('category', e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="title_asc">Name: A-Z</option>
          <option value="title_desc">Name: Z-A</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchProducts} />
      ) : products.length === 0 ? (
        <div className="py-20 text-center text-gray-600">No products found.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
          <div className="mt-10">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(p) => updateParam('page', p.toString())}
            />
          </div>
        </>
      )}
    </div>
  );
}
