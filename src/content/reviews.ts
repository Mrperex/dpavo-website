export interface Review {
  id: number;
  nameEn: string;
  nameEs: string;
  stars: 1 | 2 | 3 | 4 | 5;
  quoteEn: string;
  quoteEs: string;
  location: string;
}

export const REVIEWS: Review[] = [
  { id: 1, nameEn: 'Carlos M.', nameEs: 'Carlos M.', stars: 5, quoteEn: "Best pizza I've had in Punta Cana. La Pavorosa is insane. Came back three times in one week.", quoteEs: "La mejor pizza que he comido en Punta Cana. La Pavorosa está brutal. Volví tres veces en una semana.", location: 'Verón, Punta Cana' },
  { id: 2, nameEn: 'Melissa R.', nameEs: 'Melissa R.', stars: 5, quoteEn: 'The vibe at night is unreal. Amazing food, great music, and the energy is just different.', quoteEs: 'El ambiente de noche es increíble. Excelente comida, buena música y la energía es otra cosa.', location: 'Santo Domingo' },
  { id: 3, nameEn: 'Josh T.', nameEs: 'Josh T.', stars: 5, quoteEn: 'Stumbled in on a Friday night. Left two hours later with new friends and a full stomach. Will be back.', quoteEs: 'Entré un viernes por la noche. Salí dos horas después con amigos nuevos y la panza llena. Vuelvo seguro.', location: 'Tourist, USA' },
];
