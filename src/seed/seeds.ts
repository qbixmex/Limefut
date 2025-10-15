import { UserSeed } from '@/root/next-auth';
import { TeamSeed } from '../shared/interfaces/Team';
import { Role } from '../shared/interfaces';

const users: UserSeed[] = [
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

const teams: TeamSeed[] = [
  {
    name: 'Altamira Búfalos',
    permalink: 'altamira-bufalos',
    headquarters: 'Colegio Altamira',
    imageUrl: null,
    imagePublicID: null,
    division: '2018',
    group: '9 vs 9',
    tournament: 'Torneo Septiembre - Diciembre 2025',
    country: 'México',
    city: 'Guadalajara',
    state: 'Jalisco',
    coach: 'Rafael',
    emails: ['rafael@gmail.con', 'buffalofutbolclub@gmail.com'],
    address: 'Avenida Los Robles 734',
    active: true,
  },
  {
    name: 'Bari FC',
    permalink: 'bari-fc',
    headquarters: 'Colegio Enrique de OSSO',
    imageUrl: null,
    imagePublicID: null,
    division: '2018',
    group: '9 vs 9',
    tournament: 'Torneo Septiembre - Diciembre 2025',
    country: 'México',
    city: 'Guadalajara',
    state: 'Jalisco',
    coach: 'Rafael',
    emails: ['rafael@gmail.con', 'barifutbolclub@gmail.com'],
    address: 'Avenida Los Robles 734',
    active: true,
  },
];

export const initialData = {
  users,
  teams,
};
