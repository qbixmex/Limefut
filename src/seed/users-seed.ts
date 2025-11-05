import type { UserSeed } from '@/root/next-auth';
import type { Role } from '@/shared/interfaces';

export const users: UserSeed[] = [
  {
    name: 'Daniel Gonzalez Briseño',
    email: 'qbixmex@gmail.com',
    emailVerified: new Date('2025-01-01T00:00:00.000Z'),
    username: 'qbixmex',
    password: 'secret_password',
    roles: ['user', 'admin'] as Role[],
    imageUrl: null,
    imagePublicID: null,
    isActive: true,
  },
  {
    name: 'Moises Adrian Rodríguez Ramirez',
    email: 'limefutgdl@gmail.com',
    emailVerified: new Date('2025-01-02T00:00:00.000Z'),
    username: 'limefut',
    password: 'secret_password',
    roles: ['user', 'admin'] as Role[],
    imageUrl: null,
    imagePublicID: null,
    isActive: true,
  },
];
