import type {
  STANDING_TYPE,
  TEAM_TYPE,
  TOURNAMENT_TYPE,
} from '@/app/admin/estadisticas/(actions)/fetch-standings.action';

export const TOURNAMENT_ID = '32865b4e-e592-47c1-9ad5-f0461b8b17f5';
export const CATEGORY_ID = '6bd5a4f0-1c2e-4a7b-9e3d-2f8c1b0a4d6e';
export const LOCAL_TEAM_ID = 'a1f3c9d2-7e84-4b60-8f5a-3c2d1e0b9a48';
export const VISITOR_TEAM_ID = 'd4b7e1a0-2f63-4c95-b8a4-7e0d9c1b5f32';
export const THIRD_TEAM_ID = 'f0e1d2c3-b4a5-4968-8778-9a0b1c2d3e4f';
export const ADMIN_USER_ID = 'c9a2f5d1-3b47-4e08-9a6c-1f2d3e4b5a67';
export const PLAYER_USER_ID = '7e6d5c4b-3a2f-4109-8e7d-6c5b4a3f2e1d';

export const tournamentMock: TOURNAMENT_TYPE = {
  id: TOURNAMENT_ID,
  name: 'Liga de Prueba',
  permalink: 'liga-de-prueba',
  country: 'México',
  cities: ['Ciudad de México'],
  season: '2026',
  startDate: new Date('2026-01-10T00:00:00.000Z'),
  endDate: new Date('2026-05-30T00:00:00.000Z'),
};

export const teamsMock: TEAM_TYPE[] = [
  {
    id: LOCAL_TEAM_ID,
    name: 'Cruz Azul',
    permalink: 'cruz-azul',
    tournamentId: TOURNAMENT_ID,
    categoryId: CATEGORY_ID,
  },
  {
    id: VISITOR_TEAM_ID,
    name: 'Atlas',
    permalink: 'atlas',
    tournamentId: TOURNAMENT_ID,
    categoryId: CATEGORY_ID,
  },
];

export const standingsMock: STANDING_TYPE[] = [
  {
    matchesPlayed: 2,
    wins: 1,
    draws: 1,
    losses: 0,
    goalsFor: 4,
    goalsAgainst: 2,
    goalsDifference: 2,
    additionalPoints: 1,
    points: 4,
    tournament: {
      id: TOURNAMENT_ID,
      name: 'Liga de Prueba',
      permalink: 'liga-de-prueba',
    },
    category: {
      id: CATEGORY_ID,
      name: 'Sub-17',
      permalink: 'sub-17',
    },
    team: {
      id: LOCAL_TEAM_ID,
      name: 'Cruz Azul',
      permalink: 'cruz-azul',
    },
  },
  {
    matchesPlayed: 2,
    wins: 0,
    draws: 1,
    losses: 1,
    goalsFor: 2,
    goalsAgainst: 4,
    goalsDifference: -2,
    additionalPoints: 0,
    points: 1,
    tournament: {
      id: TOURNAMENT_ID,
      name: 'Liga de Prueba',
      permalink: 'liga-de-prueba',
    },
    category: {
      id: CATEGORY_ID,
      name: 'Sub-17',
      permalink: 'sub-17',
    },
    team: {
      id: VISITOR_TEAM_ID,
      name: 'Atlas',
      permalink: 'atlas',
    },
  },
];
