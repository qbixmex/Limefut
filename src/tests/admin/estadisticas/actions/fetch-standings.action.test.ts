const {
  mockTournamentFindFirst,
  mockTeamFindMany,
  mockStandingsFindMany,
} = vi.hoisted(() => ({
  mockTournamentFindFirst: vi.fn(),
  mockTeamFindMany: vi.fn(),
  mockStandingsFindMany: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    tournament: {
      findFirst: mockTournamentFindFirst,
    },
    team: {
      findMany: mockTeamFindMany,
    },
    standings: {
      findMany: mockStandingsFindMany,
    },
  },
}));

import { fetchStandingsAction } from '@/app/admin/estadisticas/(actions)/fetch-standings.action';
import {
  CATEGORY_ID,
  TOURNAMENT_ID,
  standingsMock,
  teamsMock,
  tournamentMock,
} from '../mocks/standings.mock';

describe('Tests on fetchStandingsAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockTournamentFindFirst.mockResolvedValue(tournamentMock);
    mockTeamFindMany.mockResolvedValue(teamsMock);
    mockStandingsFindMany.mockResolvedValue(standingsMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Fetch', () => {
    test('Should return the tournament, teams and standings', async () => {
      const response = await fetchStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(response.ok).toBe(true);
      expect(response.message).toMatch(/obtenidas correctamente/i);
      expect(response.tournament).toEqual(tournamentMock);
      expect(response.teams).toEqual(teamsMock);
      expect(response.standings).toEqual(standingsMock);
    });

    test('Should query the tournament by id', async () => {
      await fetchStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(mockTournamentFindFirst).toHaveBeenCalledWith({
        where: { id: TOURNAMENT_ID },
        select: {
          id: true,
          name: true,
          permalink: true,
          country: true,
          cities: true,
          season: true,
          startDate: true,
          endDate: true,
        },
      });
    });

    test('Should query only active teams of the tournament and category', async () => {
      await fetchStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(mockTeamFindMany).toHaveBeenCalledWith({
        where: {
          tournamentId: TOURNAMENT_ID,
          categoryId: CATEGORY_ID,
          active: true,
        },
        select: {
          id: true,
          name: true,
          permalink: true,
          tournamentId: true,
          categoryId: true,
        },
      });
    });

    test('Should order the standings by total points descending', async () => {
      await fetchStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(mockStandingsFindMany).toHaveBeenCalledWith({
        where: {
          tournamentId: TOURNAMENT_ID,
          categoryId: CATEGORY_ID,
        },
        select: {
          matchesPlayed: true,
          wins: true,
          draws: true,
          losses: true,
          goalsFor: true,
          goalsAgainst: true,
          goalsDifference: true,
          additionalPoints: true,
          points: true,
          team: {
            select: {
              id: true,
              name: true,
              permalink: true,
            },
          },
          tournament: {
            select: {
              id: true,
              name: true,
              permalink: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              permalink: true,
            },
          },
        },
        orderBy: {
          totalPoints: 'desc',
        },
      });
    });

    test('Should return an error when the tournament does not exist', async () => {
      mockTournamentFindFirst.mockResolvedValue(null);

      const response = await fetchStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(response.ok).toBe(false);
      expect(response.message).toContain(TOURNAMENT_ID);
      expect(response.teams).toEqual([]);
      expect(response.tournament).toBe(null);
      expect(response.standings).toBe(null);
      expect(mockTeamFindMany).not.toHaveBeenCalled();
      expect(mockStandingsFindMany).not.toHaveBeenCalled();
    });

    test('Should return the error message when the database throws an Error', async () => {
      mockStandingsFindMany.mockRejectedValue(new Error('DB connection failed'));

      const response = await fetchStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(response.ok).toBe(false);
      expect(response.message).toBe('DB connection failed');
      expect(response.teams).toEqual([]);
      expect(response.tournament).toBe(null);
      expect(response.standings).toBe(null);
    });

    test('Should return a generic message on an unexpected error', async () => {
      mockStandingsFindMany.mockRejectedValue('Something unexpected');

      const response = await fetchStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(response.ok).toBe(false);
      expect(response.message).toContain('Error inesperado');
      expect(response.teams).toEqual([]);
      expect(response.tournament).toBe(null);
      expect(response.standings).toBe(null);
    });
  });
});
