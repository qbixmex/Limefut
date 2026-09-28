export const coachProfileMock = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  name: 'Roberto Sánchez',
  email: 'roberto@email.com',
  phone: '+52 555 123 4567',
  age: 45,
  nationality: 'Mexicana',
  imageUrl: null,
  imagePublicID: null,
  description: 'Entrenador con experiencia en categorías formativas',
  active: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-06-15'),
  teams: [
    {
      id: 'f784c643-c39f-4867-9d7c-9b5c571a84c4',
      name: 'Eagles',
      permalink: 'eagles',
      category: {
        name: 'Sub-20',
        permalink: 'sub-20',
      },
    },
  ],
};
