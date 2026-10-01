import type { ContactMessage } from '@/shared/interfaces';

export const messagesMock: ContactMessage[] = [
  {
    id: '0d4f4f2a-1f7a-4c4e-9a3b-1c2d3e4f5a6b',
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    message: 'Quisiera más información sobre los torneos disponibles para este año.',
    read: false,
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-01-15'),
  },
  {
    id: '7b8c9d0e-2a3b-4c5d-8e9f-0a1b2c3d4e5f',
    name: 'María López',
    email: 'maria.lopez@example.com',
    message: 'Gracias por la atención prestada.',
    read: true,
    createdAt: new Date('2026-02-20'),
    updatedAt: new Date('2026-02-20'),
  },
];
