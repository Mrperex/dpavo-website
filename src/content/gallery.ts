export type GalleryCategory = 'Food' | 'Venue' | 'Events';

export interface GalleryItem {
  id: number;
  src?: string;
  alt: string;
  altEs: string;
  category: GalleryCategory;
  tone: 'red' | 'yellow' | 'cyan';
}

export const GALLERY_ITEMS: GalleryItem[] = [
  { id: 1, alt: 'La Pavorosa pizza', altEs: 'Pizza La Pavorosa', category: 'Food', tone: 'red', src: '/media/dpavo-food-1.jpg' },
  { id: 2, alt: 'Triple Queso pizza', altEs: 'Pizza Triple Queso', category: 'Food', tone: 'yellow', src: '/media/pizza-queso.jpg' },
  { id: 3, alt: 'Maresía Tropical', altEs: 'Maresía Tropical', category: 'Food', tone: 'cyan', src: '/media/dpavo-food-2.jpg' },
  { id: 4, alt: "D'Pavo venue at night", altEs: "D'Pavo de noche", category: 'Venue', tone: 'red', src: '/media/nightlife.jpg' },
  { id: 5, alt: "DJ set at D'Pavo", altEs: "Set de DJ en D'Pavo", category: 'Events', tone: 'cyan', src: '/media/dj-events.jpg' },
  { id: 6, alt: 'Karaoke night crowd', altEs: 'Multitud en noche de karaoke', category: 'Events', tone: 'yellow', src: '/media/dpavo-food-3.jpg' },
  { id: 7, alt: "D'Pavo bar area", altEs: "Área de barra de D'Pavo", category: 'Venue', tone: 'yellow', src: '/media/pizza-venue.jpg' },
  { id: 8, alt: 'Urban Beats Live event', altEs: 'Evento Urban Beats Live', category: 'Events', tone: 'red', src: '/media/nightlife.jpg' },
  { id: 9, alt: 'Alitas Infierno', altEs: 'Alitas Infierno', category: 'Food', tone: 'red', src: '/media/alitas.jpg' },
];
