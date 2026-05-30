import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-lg font-bold text-gray-900">ShopHub</h3>
            <p className="text-sm text-gray-600">
              Your one-stop destination for quality products at great prices.
            </p>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-gray-900">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link to="/products" className="hover:text-primary-600">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-primary-600">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-primary-600">
                  Order History
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-gray-900">Contact</h4>
            <p className="text-sm text-gray-600">support@shophub.com</p>
            <p className="text-sm text-gray-600">1-800-SHOP-HUB</p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-100 pt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} ShopHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
