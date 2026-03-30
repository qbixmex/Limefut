import { MATCH_STATUS } from '@/shared/enums';

export const latestMatches = [
  {
    id: '776a34b9-c677-4581-a335-db768170fb26',
    tournament: {
      name: 'Torneo Jóvenes Promesas',
      permalink: 'torneo-jovenes-promesas',
      currentWeek: 1,
    },
    localTeam: {
      id: '48f1b9c3-2908-400a-bd83-ff5c8a035ed6',
      name: 'Chivas',
      permalink: 'chivas',
      category: '2015',
      format: '9',
      imageUrl: 'https://cloudinary.com/chivas.webp',
    },
    visitorTeam: {
      id: '1e97f8a2-658e-4f42-8bb0-2a466591b56c',
      name: 'Atlas',
      permalink: 'atlas',
      imageUrl: 'https://cloudinary.com/atlas.webp',
    },
    localScore: 2,
    visitorScore: 3,
    status: MATCH_STATUS.COMPLETED,
    week: 1,
    place: 'Estadio Akron',
    matchDate: new Date('2024-04-27T16:00:00.000Z'),
    penaltyShoots: null,
  },
  {
    id: 'bfa00bc2-c26d-4cc2-b130-38529aecf341',
    tournament: {
      name: 'Torneo de Verano',
      permalink: 'torneo-verano',
      currentWeek: 1,
    },
    localTeam: {
      id: '749807db-d6ab-453a-a02e-c8bdc6fb7dc0',
      name: 'Cruz Azúl',
      permalink: 'cruz-azul',
      category: '2015',
      format: '9',
      imageUrl: 'https://cloudinary.com/cruz-azul.webp',
    },
    visitorTeam: {
      id: 'c412636c-a729-42e9-a70f-0d0ee567f610',
      name: 'Toluca',
      permalink: 'toluca',
      imageUrl: 'https://cloudinary.com/toluca.webp',
    },
    localScore: 2,
    visitorScore: 1,
    status: MATCH_STATUS.COMPLETED,
    week: 1,
    place: 'Estadio Azteca',
    matchDate: new Date('2024-04-27T20:00:00.000Z'),
    penaltyShoots: null,
  },
];
