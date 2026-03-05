import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getCart,
  addToCart as addItem,
  updateCartQuantity,
  removeFromCart as removeItem,
  clearCart as emptyCart,
  getCartTotal,
  getCartCount
} from '../utils/cart';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    setCart(getCart());
  }, []);

  const addToCart = useCallback((product, quantity = 1) => {
    const updated = addItem(product, quantity);
    setCart([...updated]);
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    const updated = updateCartQuantity(id, quantity);
    setCart([...updated]);
  }, []);

  const removeFromCart = useCallback((id) => {
    const updated = removeItem(id);
    setCart([...updated]);
  }, []);

  const clearCart = useCallback(() => {
    const updated = emptyCart();
    setCart([...updated]);
  }, []);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const total = getCartTotal(cart);
  const count = getCartCount(cart);

  return (
    <CartContext.Provider value={{
      cart,
      count,
      total,
      isOpen,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      openCart,
      closeCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
