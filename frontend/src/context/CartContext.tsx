import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { Cart, CartItem } from '../types';
import { cartApi } from '../services/cart.service';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const emptyCart: Cart = { items: [], total: 0, itemCount: 0 };

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setCart(emptyCart);
      return;
    }
    setLoading(true);
    try {
      const { data } = await cartApi.getCart();
      setCart(data);
    } catch {
      setCart(emptyCart);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(
    async (productId: string, quantity = 1) => {
      await cartApi.addItem(productId, quantity);
      await refreshCart();
    },
    [refreshCart]
  );

  const updateQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      await cartApi.updateQuantity(itemId, quantity);
      await refreshCart();
    },
    [refreshCart]
  );

  const removeFromCart = useCallback(
    async (itemId: string) => {
      await cartApi.removeItem(itemId);
      await refreshCart();
    },
    [refreshCart]
  );

  return (
    <CartContext.Provider
      value={{
        cart: cart ?? emptyCart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
