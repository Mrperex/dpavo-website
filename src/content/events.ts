export interface DPavoEvent {
  id: number;
  titleEn: string;
  titleEs: string;
  dayEn: string;
  dayEs: string;
  date: string;
  time: string;
  location: string;
  descriptionEn: string;
  descriptionEs: string;
  tag: string;
  featured?: boolean;
}

export const EVENTS: DPavoEvent[] = [
  { id: 1, titleEn: 'Karaoke Night Out', titleEs: 'Noche de Karaoke', dayEn: 'Thursday', dayEs: 'Jueves', date: 'Every Thursday', time: '9:00 PM', location: 'Main Lounge', descriptionEn: "Crowd energy, singalong moments and the best weekly event that keeps D'Pavo alive.", descriptionEs: "Energía en masa, momentos de karaoke y el mejor evento semanal que mantiene vivo D'Pavo.", tag: 'Karaoke' },
  { id: 2, titleEn: 'Urban Beats Live', titleEs: 'Urban Beats en Vivo', dayEn: 'Friday', dayEs: 'Viernes', date: 'Every Friday', time: '11:00 PM', location: 'DJ Floor', descriptionEn: "DJ sets, lights, premium drinks and Verón's best crowd.", descriptionEs: "DJs, luces, tragos premium y el mejor ambiente de Verón.", tag: 'DJ Set', featured: true },
  { id: 3, titleEn: "D'Pavo Madness", titleEs: "D'Pavo Madness", dayEn: 'Saturday', dayEs: 'Sábado', date: 'Every Saturday', time: 'All Night', location: 'Full Venue', descriptionEn: 'Peak nightlife identity. VIP energy, full venue experience and the biggest night of the week.', descriptionEs: 'La identidad nocturna al máximo. Energía VIP y la noche más grande de la semana.', tag: 'Main Event' },
];
