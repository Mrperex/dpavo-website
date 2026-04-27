'use client';

import { useState } from 'react';
import { ShoppingCart, X, Trash2, Plus, Minus, MessageCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { WHATSAPP_NUMBER } from '@/content/config';
import styles from './CartDrawer.module.css';

function buildWAMessage(items: { name: string; qty: number; price: string }[], total: number): string {
  const lines = items.map((i) => `• ${i.name} x${i.qty} — ${i.price}`).join('\n');
  const totalStr = total > 0 ? `RD$ ${total.toLocaleString('es-DO')}` : '—';
  return `Hola D'Pavo! 🍕 Quiero hacer el siguiente pedido:\n\n${lines}\n\nTotal aprox: ${totalStr}\n\nGracias!`;
}

export function CartDrawer() {
  const { items, removeItem, setQty, clearCart, totalItems, totalPrice } = useCart();
  const [open, setOpen] = useState(false);

  const checkout = () => {
    const msg = buildWAMessage(items, totalPrice);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        className={styles.fab}
        onClick={() => setOpen(true)}
        aria-label="Ver carrito"
        type="button"
      >
        <ShoppingCart size={22} />
        {totalItems > 0 && (
          <span className={styles.badge}>{totalItems > 99 ? '99+' : totalItems}</span>
        )}
      </button>

      {/* Backdrop */}
      {open && <div className={styles.backdrop} onClick={() => setOpen(false)} aria-hidden="true" />}

      {/* Drawer panel */}
      <div className={`${styles.drawer} ${open ? styles.open : ''}`} role="dialog" aria-label="Carrito de pedido">
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <ShoppingCart size={18} />
            <span>Tu Pedido</span>
            {totalItems > 0 && <span className={styles.headerCount}>{totalItems}</span>}
          </div>
          <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Cerrar carrito">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className={styles.items}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <ShoppingCart size={40} strokeWidth={1} />
              <p>Tu carrito está vacío</p>
              <span>Agrega platos desde el menú</span>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className={styles.item}>
                {item.image && (
                  <img src={item.image} alt={item.name} className={styles.itemImg} />
                )}
                <div className={styles.itemInfo}>
                  <p className={styles.itemName}>{item.name}</p>
                  <p className={styles.itemPrice}>{item.price}</p>
                </div>
                <div className={styles.itemControls}>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => item.qty === 1 ? removeItem(item.id) : setQty(item.id, item.qty - 1)}
                    aria-label="Reducir cantidad"
                  >
                    <Minus size={14} />
                  </button>
                  <span className={styles.qty}>{item.qty}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={() => setQty(item.id, item.qty + 1)}
                    aria-label="Aumentar cantidad"
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    className={`${styles.qtyBtn} ${styles.removeBtn}`}
                    onClick={() => removeItem(item.id)}
                    aria-label="Eliminar"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.total}>
              <span>Total aprox.</span>
              <span className={styles.totalPrice}>RD$ {totalPrice.toLocaleString('es-DO')}</span>
            </div>
            <button className={styles.checkoutBtn} onClick={checkout}>
              <MessageCircle size={16} /> Pedir por WhatsApp
            </button>
            <button className={styles.clearBtn} onClick={clearCart}>
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
}
