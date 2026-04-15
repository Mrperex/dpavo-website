export type MenuCategory = 'Pizza' | 'Mariscos' | 'Picaderas' | 'Drinks';

export interface MenuItem {
  id: number;
  name: string;
  subtitle: string;
  description: string;
  descriptionEs: string;
  price: string;
  category: MenuCategory;
  featured: boolean;
  image?: string;
  tone: 'red' | 'yellow' | 'cyan' | 'white';
}

export const MENU_ITEMS: MenuItem[] = [
  { id: 1, name: 'La Pavorosa', subtitle: 'Ultimate Mix', description: 'Angus beef, artisan pepperoni, caramelized onion and truffle oil.', descriptionEs: 'Carne de res angus, pepperoni artesanal, cebolla caramelizada y aceite de trufa.', price: 'RD$1,300', category: 'Pizza', featured: true, image: '/media/pizza-ham-and-pepperonni.png', tone: 'red' },
  { id: 2, name: 'Triple Queso', subtitle: 'Triple Cheese', description: 'Premium mozzarella, artisanal cheddar and melted gouda with urban herbs.', descriptionEs: 'Mozzarella premium, cheddar artesanal y gouda fundido con hierbas urbanas.', price: 'RD$1,100', category: 'Pizza', featured: true, image: '/media/pizza-cheese.png', tone: 'yellow' },
  { id: 3, name: 'Maresía Tropical', subtitle: 'Seafood Mix', description: 'Jumbo shrimp and calamari sautéed with coconut butter and cilantro.', descriptionEs: 'Camarones jumbo y calamares salteados con mantequilla de coco y cilantro.', price: 'RD$1,450', category: 'Mariscos', featured: true, image: '/media/pizza-shrimps.png', tone: 'cyan' },
  { id: 4, name: 'Pepperoni Hot Honey', subtitle: 'Classic Heat', description: 'Pepperoni, mozzarella and a sweet-hot glaze to finish strong.', descriptionEs: 'Pepperoni, mozzarella y un glaze picante-dulce para cerrar con fuerza.', price: 'RD$1,200', category: 'Pizza', featured: false, image: '/media/pizza-pepperoni.png', tone: 'red' },
  { id: 5, name: 'Alitas Infierno', subtitle: 'Hell Wings', description: 'Crispy wings with secret ají caballero sauce and Dominican honey.', descriptionEs: 'Alitas crujientes con salsa secreta de ají caballero y miel dominicana.', price: 'RD$750', category: 'Picaderas', featured: false, image: '/media/alitas-infierno.png', tone: 'red' },
  { id: 6, name: 'Chinola Sour', subtitle: 'Passion Mix', description: 'Fresh passionfruit, premium rum and a citrus blend that tastes like Punta Cana.', descriptionEs: 'Maracuyá fresco, ron premium y mezcla cítrica que sabe a Punta Cana.', price: 'RD$600', category: 'Drinks', featured: false, image: '/media/chinola-sour.png', tone: 'yellow' },
  { id: 7, name: 'Tostones Especiales', subtitle: 'Dominican Classic', description: 'Twice-fried plantain, topped with shrimp and garlic sauce.', descriptionEs: 'Tostones dobles fritos, coronados con camarones y salsa de ajo.', price: 'RD$700', category: 'Picaderas', featured: false, image: '/media/tostones-especiales.png', tone: 'yellow' },
  { id: 8, name: 'Pavo Blanco', subtitle: 'White Sauce', description: 'Ricotta base, roasted garlic, mushrooms and fresh basil.', descriptionEs: 'Base de ricotta, ajo asado, champiñones y albahaca fresca.', price: 'RD$1,150', category: 'Pizza', featured: false, image: '/media/pizza-bassil.png', tone: 'white' },
  { id: 9, name: 'Veggies Supreme', subtitle: 'Garden Fresh', description: 'Roasted peppers, zucchini, tomato and pesto on a garlic base.', descriptionEs: 'Pimientos asados, zucchini, tomate y pesto sobre base de ajo.', price: 'RD$1,050', category: 'Pizza', featured: false, image: '/media/pizza-veggies.png', tone: 'yellow' },
  { id: 10, name: 'Chicken BBQ', subtitle: 'Smoky & Tender', description: 'Grilled chicken, smoked cheddar, caramelized onion and house BBQ sauce.', descriptionEs: 'Pollo a la parrilla, cheddar ahumado, cebolla caramelizada y salsa BBQ de la casa.', price: 'RD$1,200', category: 'Pizza', featured: false, image: '/media/pizza-chicken.png', tone: 'red' },
  { id: 11, name: 'Hongos & Trufa', subtitle: 'Earthy & Rich', description: 'Wild mushroom blend, fontina, truffle oil and fresh thyme.', descriptionEs: 'Mezcla de hongos silvestres, fontina, aceite de trufa y tomillo fresco.', price: 'RD$1,250', category: 'Pizza', featured: false, image: '/media/pizza-hongos.png', tone: 'white' },
  { id: 12, name: 'Hawaiana Caribeña', subtitle: 'Tropical Twist', description: 'Ham, pineapple, jalapeño and coconut-chipotle glaze.', descriptionEs: 'Jamón, piña, jalapeño y glaze de coco-chipotle.', price: 'RD$1,150', category: 'Pizza', featured: false, image: '/media/pizza-hawaiian.png', tone: 'yellow' },
];
