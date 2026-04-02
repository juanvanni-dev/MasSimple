import { useState, useCallback } from 'react';
import { CartItem } from '@/types/product';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = useCallback((item: Omit<CartItem, 'key' | 'qty'>) => {
    setCart(prev => {
      const key = `${item.pid}-${item.oi}-${item.flavor || ''}`;
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, key, qty: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((key: string) => {
    setCart(prev => prev.filter(i => i.key !== key));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return {
    cart, isOpen, setIsOpen,
    addToCart, removeFromCart, clearCart,
    totalItems, totalPrice,
  };
}
