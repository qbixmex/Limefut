const {
  mockTournamentFindFirst,
  mockTeamFindMany,
  mockStandingsFindMany,
  mockGetSession,
} = vi.hoisted(() => ({
  mockTournamentFindFirst: vi.fn(),
  mockTeamFindMany: vi.fn(),
  mockStandingsFindMany: vi.fn(),
  mockGetSession: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('@/lib/get-session', () => ({
  getSession: mockGetSession,
  requireAdmin: async () => {
    const session = await mockGetSession();

    if (!session?.user) {
      return {
        ok: false,
        message: '¡ Debes estar autentificado para realizar esta acción !',
      };
    }

    if (!session.user.roles?.includes('admin')) {
      return {
        ok: false,
        message: '¡ No tienes permisos administrativos para realizar esta acción !',
      };
    }

    return { ok: true, session };
  },
}));

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
  ADMIN_USER_ID,
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
    mockGetSession.mockResolvedValue({
      user: { id: ADMIN_USER_ID, roles: ['admin'] },
    });
    mockTournamentFindFirst.mockResolvedValue(tournamentMock);
    mockTeamFindMany.mockResolvedValue(teamsMock);
    mockStandingsFindMany.mockResolvedValue(standingsMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Authentication', () => {
    test('Should return error when there is no session', async () => {
      mockGetSession.mockResolvedValue(null);

      const response = await fetchStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(response.ok).toBe(false);
      expect(response.message).toBe('¡ Debes estar autentificado para realizar esta acción !');
      expect(response.teams).toEqual([]);
      expect(response.tournament).toBe(null);
      expect(response.standings).toBe(null);
      expect(mockTournamentFindFirst).not.toHaveBeenCalled();
    });

    test('Should return error when user is not admin', async () => {
      mockGetSession.mockResolvedValue({
        user: { id: ADMIN_USER_ID, roles: ['user'] },
      });

      const response = await fetchStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(response.ok).toBe(false);
      expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
      expect(mockTournamentFindFirst).not.toHaveBeenCalled();
    });

    test('Should return error when roles are null', async () => {
      mockGetSession.mockResolvedValue({
        user: { id: ADMIN_USER_ID, roles: null },
      });

      const response = await fetchStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(response.ok).toBe(false);
      expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
      expect(mockTournamentFindFirst).not.toHaveBeenCalled();
    });

    test('Should return error when roles are empty', async () => {
      mockGetSession.mockResolvedValue({
        user: { id: ADMIN_USER_ID, roles: [] },
      });

      const response = await fetchStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(response.ok).toBe(false);
      expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
      expect(mockTournamentFindFirst).not.toHaveBeenCalled();
    });
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
