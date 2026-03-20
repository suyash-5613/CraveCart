import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], restaurant: null });
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCart({ items: [], restaurant: null });
      setCartCount(0);
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      const res = await cartAPI.get();
      const cartData = res.data.data;
      setCart(cartData);
      setCartCount(cartData.items?.reduce((sum, item) => sum + item.quantity, 0) || 0);
    } catch (err) {
      console.error('Failed to load cart');
    }
  };

  const addToCart = async (menuItemId, restaurantId, quantity = 1) => {
    try {
      const res = await cartAPI.add({ menuItemId, restaurantId, quantity });
      const cartData = res.data.data;
      setCart(cartData);
      setCartCount(cartData.items?.reduce((sum, item) => sum + item.quantity, 0) || 0);
      return true;
    } catch (err) {
      console.error('Failed to add to cart', err);
      return false;
    }
  };

  const updateQuantity = async (menuItemId, quantity) => {
    try {
      const res = await cartAPI.update({ menuItemId, quantity });
      const cartData = res.data.data;
      setCart(cartData);
      setCartCount(cartData.items?.reduce((sum, item) => sum + item.quantity, 0) || 0);
    } catch (err) {
      console.error('Failed to update cart');
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      setCart({ items: [], restaurant: null });
      setCartCount(0);
    } catch (err) {
      console.error('Failed to clear cart');
    }
  };

  const getTotal = () => {
    if (!cart.items || cart.items.length === 0) return 0;
    return cart.items.reduce((sum, item) => {
      const price = item.menuItem?.price || item.price || 0;
      return sum + price * item.quantity;
    }, 0);
  };

  const value = {
    cart,
    cartCount,
    addToCart,
    updateQuantity,
    clearCart,
    loadCart,
    getTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
