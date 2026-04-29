export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', name, params);
}

export function trackViewMenu(category: string) {
  trackEvent('view_menu', { event_category: 'Menu', event_label: category });
}

export function trackAddToCart(item: { id: number; name: string; price: string; category: string }) {
  trackEvent('add_to_cart', {
    currency: 'DOP',
    items: [{ item_id: String(item.id), item_name: item.name, item_category: item.category, price: item.price }],
  });
}

export function trackInitiateCheckout(itemCount: number, total: number) {
  trackEvent('begin_checkout', { currency: 'DOP', value: total, num_items: itemCount });
}

export function trackClickWhatsApp(source: string) {
  trackEvent('click_whatsapp', { event_category: 'CTA', event_label: source });
}

export function trackReservation() {
  trackEvent('generate_lead', { event_category: 'Reservations' });
}

export function trackNewsletterSignup() {
  trackEvent('sign_up', { method: 'newsletter' });
}

export function trackSearch(query: string, results: number) {
  trackEvent('search', { search_term: query, num_results: results });
}
