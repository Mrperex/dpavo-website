'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ShoppingCart, X, Trash2, Plus, Minus, MessageCircle, StickyNote, Truck, Store, ChevronDown } from 'lucide-react';
import { useCart, type CartEntry, type FulfillmentMode, type CustomerInfo } from '@/context/CartContext';
import { WHATSAPP_NUMBER } from '@/content/config';
import styles from './CartDrawer.module.css';

function fmt(n: number): string {
  return `RD$ ${n.toLocaleString('es-DO', { maximumFractionDigits: 0 })}`;
}

function buildWAMessage(
  items: CartEntry[],
  subtotal: number,
  fulfillment: FulfillmentMode,
  customer: CustomerInfo,
): string {
  const lines = items.map((i) => {
    const base = `• ${i.name} x${i.qty} — ${i.price}`;
    return i.note ? `${base}\n   _Nota: ${i.note}_` : base;
  }).join('\n');

  const fulfillmentLabel = fulfillment === 'delivery' ? '🛵 Delivery' : '🏪 Pickup';
  const customerBlock = [
    `*Cliente:* ${customer.name || '—'}`,
    `*Teléfono:* ${customer.phone || '—'}`,
    fulfillment === 'delivery' ? `*Dirección:* ${customer.address || '—'}` : null,
  ].filter(Boolean).join('\n');

  return [
    `Hola D'Pavo! 🍕 Quiero hacer el siguiente pedido:`,
    ``,
    lines,
    ``,
    `*Modalidad:* ${fulfillmentLabel}`,
    customerBlock,
    ``,
    `*Subtotal:* ${fmt(subtotal)}`,
    ``,
    `Gracias!`,
  ].join('\n');
}

function ItemRow({ item }: { item: CartEntry }) {
  const { setQty, removeItem, setNote } = useCart();
  const [noteOpen, setNoteOpen] = useState(Boolean(item.note));

  return (
    <div className={styles.item}>
      <div className={styles.itemMain}>
        {item.image && (
          <div className={styles.itemImg}>
            <Image src={item.image} alt={item.name} fill sizes="48px" style={{ objectFit: 'cover' }} />
          </div>
        )}
        <div className={styles.itemInfo}>
          <p className={styles.itemName}>{item.name}</p>
          <p className={styles.itemPrice}>{item.price}</p>
        </div>
        <div className={styles.itemControls}>
          <button
            type="button"
            className={styles.qtyBtn}
            onClick={() => item.qty === 1 ? removeItem(item.id) : setQty(item.id, item.qty - 1)}
            aria-label="Reducir cantidad"
          >
            <Minus size={14} />
          </button>
          <span className={styles.qty}>{item.qty}</span>
          <button
            type="button"
            className={styles.qtyBtn}
            onClick={() => setQty(item.id, item.qty + 1)}
            aria-label="Aumentar cantidad"
          >
            <Plus size={14} />
          </button>
          <button
            type="button"
            className={`${styles.qtyBtn} ${styles.removeBtn}`}
            onClick={() => removeItem(item.id)}
            aria-label="Eliminar"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className={styles.itemNoteRow}>
        {!noteOpen && !item.note ? (
          <button
            type="button"
            className={styles.addNoteBtn}
            onClick={() => setNoteOpen(true)}
          >
            <StickyNote size={12} /> Agregar nota
          </button>
        ) : (
          <textarea
            className={styles.noteInput}
            placeholder="Ej: extra queso, sin cebolla, picante…"
            value={item.note ?? ''}
            onChange={(e) => setNote(item.id, e.target.value)}
            onBlur={() => { if (!item.note) setNoteOpen(false); }}
            rows={2}
            maxLength={200}
            aria-label={`Nota para ${item.name}`}
          />
        )}
      </div>
    </div>
  );
}

export function CartDrawer() {
  const {
    items, clearCart, totalItems, totalPrice, lastAddedAt,
    fulfillment, setFulfillment, customer, setCustomer,
  } = useCart();
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const fabRef = useRef<HTMLButtonElement>(null);

  // Bump animation when an item is added
  useEffect(() => {
    if (lastAddedAt === 0) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 420);
    return () => clearTimeout(t);
  }, [lastAddedAt]);

  // Reset confirmClear if drawer closes
  useEffect(() => {
    if (!open) setConfirmClear(false);
  }, [open]);

  const canCheckout = items.length > 0
    && customer.name.trim().length > 0
    && customer.phone.trim().length >= 7
    && (fulfillment === 'pickup' || customer.address.trim().length > 3);

  const checkout = () => {
    if (!canCheckout) return;
    const msg = buildWAMessage(items, totalPrice, fulfillment, customer);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const updateCustomer = (field: keyof CustomerInfo, value: string) => {
    setCustomer({ ...customer, [field]: value });
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        ref={fabRef}
        type="button"
        className={`${styles.fab} ${bump ? styles.bump : ''}`}
        onClick={() => setOpen(true)}
        aria-label={`Ver carrito${totalItems > 0 ? ` (${totalItems} items)` : ''}`}
      >
        <ShoppingCart size={22} />
        {totalItems > 0 && (
          <span className={styles.badge} aria-hidden="true">
            {totalItems > 99 ? '99+' : totalItems}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {open && <div className={styles.backdrop} onClick={() => setOpen(false)} aria-hidden="true" />}

      {/* Drawer panel */}
      <div
        className={`${styles.drawer} ${open ? styles.open : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Carrito de pedido"
        aria-hidden={!open}
      >
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <ShoppingCart size={18} />
            <span>Tu Pedido</span>
            {totalItems > 0 && <span className={styles.headerCount}>{totalItems}</span>}
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={() => setOpen(false)}
            aria-label="Cerrar carrito"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className={styles.body}>
          {items.length === 0 ? (
            <div className={styles.empty}>
              <ShoppingCart size={40} strokeWidth={1} />
              <p>Tu carrito está vacío</p>
              <span>Agrega platos desde el menú</span>
            </div>
          ) : (
            <>
              {/* Items */}
              <div className={styles.items}>
                {items.map((item) => <ItemRow key={item.id} item={item} />)}
              </div>

              {/* Fulfillment toggle */}
              <div className={styles.section}>
                <label className={styles.sectionLabel}>Modalidad</label>
                <div className={styles.fulfillmentToggle} role="radiogroup" aria-label="Modalidad de pedido">
                  <button
                    type="button"
                    role="radio"
                    aria-checked={fulfillment === 'pickup'}
                    className={`${styles.fulfillmentOption} ${fulfillment === 'pickup' ? styles.fulfillmentActive : ''}`}
                    onClick={() => setFulfillment('pickup')}
                  >
                    <Store size={14} /> Pickup
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={fulfillment === 'delivery'}
                    className={`${styles.fulfillmentOption} ${fulfillment === 'delivery' ? styles.fulfillmentActive : ''}`}
                    onClick={() => setFulfillment('delivery')}
                  >
                    <Truck size={14} /> Delivery
                  </button>
                </div>
              </div>

              {/* Customer info */}
              <div className={styles.section}>
                <label className={styles.sectionLabel}>Tus datos</label>
                <input
                  type="text"
                  className={styles.fieldInput}
                  placeholder="Nombre"
                  value={customer.name}
                  onChange={(e) => updateCustomer('name', e.target.value)}
                  autoComplete="name"
                  aria-label="Tu nombre"
                />
                <input
                  type="tel"
                  className={styles.fieldInput}
                  placeholder="Teléfono / WhatsApp"
                  value={customer.phone}
                  onChange={(e) => updateCustomer('phone', e.target.value)}
                  autoComplete="tel"
                  inputMode="tel"
                  aria-label="Tu teléfono"
                />
                {fulfillment === 'delivery' && (
                  <input
                    type="text"
                    className={styles.fieldInput}
                    placeholder="Dirección de entrega"
                    value={customer.address}
                    onChange={(e) => updateCustomer('address', e.target.value)}
                    autoComplete="street-address"
                    aria-label="Dirección de entrega"
                  />
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.total}>
              <span>Subtotal</span>
              <span className={styles.totalPrice}>{fmt(totalPrice)}</span>
            </div>
            <p className={styles.totalNote}>
              {fulfillment === 'delivery'
                ? 'Costo de delivery se confirma por WhatsApp según ubicación.'
                : 'Pickup en Plaza Verón Center.'}
            </p>
            <button
              type="button"
              className={styles.checkoutBtn}
              onClick={checkout}
              disabled={!canCheckout}
              aria-disabled={!canCheckout}
            >
              <MessageCircle size={16} /> Pedir por WhatsApp
            </button>
            {!canCheckout && items.length > 0 && (
              <p className={styles.helperHint}>
                <ChevronDown size={12} /> Completa tus datos para continuar
              </p>
            )}
            {confirmClear ? (
              <div className={styles.confirmRow}>
                <span>¿Vaciar todo?</span>
                <button type="button" className={styles.confirmYes} onClick={() => { clearCart(); setConfirmClear(false); }}>
                  Sí
                </button>
                <button type="button" className={styles.confirmNo} onClick={() => setConfirmClear(false)}>
                  Cancelar
                </button>
              </div>
            ) : (
              <button type="button" className={styles.clearBtn} onClick={() => setConfirmClear(true)}>
                Vaciar carrito
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
