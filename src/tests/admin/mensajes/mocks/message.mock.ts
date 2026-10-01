import type { ContactMessage } from '@/shared/interfaces';

export const messageMock: ContactMessage = {
  id: '550e8400-e29b-41d4-a716-446655440010',
  name: 'Juan Pérez',
  email: 'juan.perez@example.com',
  message: 'Quisiera más información sobre los torneos disponibles.',
  read: false,
  createdAt: new Date('2026-01-15'),
  updatedAt: new Date('2026-01-15'),
};
