export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  userId: string;
  productId: string;
  product: Product;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  orderId: string;
  productId: string;
  product: Product;
}

export interface Order {
  id: string;
  total: number;
  status: OrderStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  user?: Pick<User, 'id' | 'name' | 'email'>;
}

export interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  categories: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  errors?: { field: string; message: string }[];
}
