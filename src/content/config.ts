export const WHATSAPP_NUMBER = '18297531995';

export function wa(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WA_ORDER = (item: string) => wa(`Quisiera ordenar: ${item}`);
export const WA_RESERVE = (event: string) => wa(`Quisiera reservar una mesa para: ${event}`);
export const WA_GENERAL = wa('Hola, me gustaría obtener más información.');
export const WA_EVENTS = wa('Quisiera recibir notificaciones de eventos.');
export const WA_CATERING = wa('Hola, me gustaría solicitar una cotización de catering para un evento privado.');
