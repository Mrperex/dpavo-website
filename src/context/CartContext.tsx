'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';

const STORAGE_KEY = 'dpavo-cart';

export interface CartItem {
  id: string;
  name: string;
  price: string;
  image?: string;
}

interface CartEntry extends CartItem {
  priceNum: number;
  qty: number;
}

interface CartContextValue {
  items: CartEntry[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

function parsePrice(price: string): number {
  // Commas are thousands separators in DR peso format (RD$1,300 = 1300)
  return parseInt(price.replace(/[^0-9]/g, ''), 10) || 0;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartEntry[]>([]);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {}
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch {}
  }, [items]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((e) => e.id === item.id);
      if (existing) {
        return prev.map((e) => e.id === item.id ? { ...e, qty: e.qty + 1 } : e);
      }
      return [...prev, { ...item, priceNum: parsePrice(item.price), qty: 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    if (qty < 1) return;
    setItems((prev) => prev.map((e) => e.id === id ? { ...e, qty } : e));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, e) => sum + e.qty, 0);
  const totalPrice = items.reduce((sum, e) => sum + e.priceNum * e.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, setQty, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
