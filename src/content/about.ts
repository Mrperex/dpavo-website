export const SHOW_TEAM_SECTION = false;

export interface TeamMember {
  name: string;
  role: string;
  roleEs: string;
  image?: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  { name: 'Placeholder', role: 'Founder', roleEs: 'Fundador' },
  { name: 'Placeholder', role: 'Head Chef', roleEs: 'Chef Principal' },
  { name: 'Placeholder', role: 'Events Director', roleEs: 'Director de Eventos' },
];
