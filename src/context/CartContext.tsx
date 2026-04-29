'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';

const STORAGE_KEY = 'dpavo-cart-v2';

export type FulfillmentMode = 'pickup' | 'delivery';

export interface CartItem {
  id: string;
  name: string;
  price: string;
  image?: string;
}

export interface CartEntry extends CartItem {
  priceNum: number;
  qty: number;
  note?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
}

interface PersistedState {
  items: CartEntry[];
  fulfillment: FulfillmentMode;
  customer: CustomerInfo;
}

interface CartContextValue {
  items: CartEntry[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  setNote: (id: string, note: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  // last-add tracking for badge bump animation
  lastAddedAt: number;
  // fulfillment + customer data
  fulfillment: FulfillmentMode;
  setFulfillment: (m: FulfillmentMode) => void;
  customer: CustomerInfo;
  setCustomer: (c: CustomerInfo) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function parsePrice(price: string): number {
  // Commas are thousands separators in DR peso format (RD$1,300 = 1300)
  return parseInt(price.replace(/[^0-9]/g, ''), 10) || 0;
}

const EMPTY_CUSTOMER: CustomerInfo = { name: '', phone: '', address: '' };

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartEntry[]>([]);
  const [fulfillment, setFulfillment] = useState<FulfillmentMode>('pickup');
  const [customer, setCustomer] = useState<CustomerInfo>(EMPTY_CUSTOMER);
  const [lastAddedAt, setLastAddedAt] = useState(0);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as PersistedState;
        if (Array.isArray(parsed.items)) setItems(parsed.items);
        if (parsed.fulfillment === 'pickup' || parsed.fulfillment === 'delivery') {
          setFulfillment(parsed.fulfillment);
        }
        if (parsed.customer && typeof parsed.customer === 'object') {
          setCustomer({
            name: parsed.customer.name ?? '',
            phone: parsed.customer.phone ?? '',
            address: parsed.customer.address ?? '',
          });
        }
      }
    } catch {}
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      const state: PersistedState = { items, fulfillment, customer };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [items, fulfillment, customer]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((e) => e.id === item.id);
      if (existing) {
        return prev.map((e) => e.id === item.id ? { ...e, qty: e.qty + 1 } : e);
      }
      return [...prev, { ...item, priceNum: parsePrice(item.price), qty: 1 }];
    });
    setLastAddedAt(Date.now());
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    if (qty < 1) return;
    setItems((prev) => prev.map((e) => e.id === id ? { ...e, qty } : e));
  }, []);

  const setNote = useCallback((id: string, note: string) => {
    setItems((prev) => prev.map((e) => e.id === id ? { ...e, note: note.slice(0, 200) } : e));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, e) => sum + e.qty, 0);
  const totalPrice = items.reduce((sum, e) => sum + e.priceNum * e.qty, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        setQty,
        setNote,
        clearCart,
        totalItems,
        totalPrice,
        lastAddedAt,
        fulfillment,
        setFulfillment,
        customer,
        setCustomer,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
