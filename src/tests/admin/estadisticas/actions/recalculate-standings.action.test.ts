const { mockTransaction, mockTeamFindMany, mockGetSession } = vi.hoisted(() => ({
  mockTransaction: vi.fn(),
  mockTeamFindMany: vi.fn(),
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
        message: 'Debes estar autentificado para realizar esta acción',
      };
    }

    if (!session.user.roles?.includes('admin')) {
      return {
        ok: false,
        message: 'No tienes permisos administrativos para realizar esta acción',
      };
    }

    return { ok: true, session };
  },
}));

vi.mock('@/lib/prisma', () => ({
  default: {
    team: {
      findMany: mockTeamFindMany,
    },
    $transaction: mockTransaction,
  },
}));

import { recalculateStandingsAction } from '@/app/admin/estadisticas/(actions)/recalculate-standings.action';
import {
  ADMIN_USER_ID,
  CATEGORY_ID,
  LOCAL_TEAM_ID,
  TOURNAMENT_ID,
  VISITOR_TEAM_ID,
} from '../mocks/standings.mock';

type MockMatch = {
  localId: string;
  visitorId: string;
  localScore: number | null;
  visitorScore: number | null;
  categoryId: string | null;
  penaltyShootout: { winnerTeamId: string | null } | null;
};

const mockTx = {
  standings: {
    deleteMany: vi.fn(),
    createMany: vi.fn(),
    upsert: vi.fn(),
  },
  match: {
    findMany: vi.fn(),
  },
};

const completedMatch = (overrides: Partial<MockMatch> = {}): MockMatch => ({
  localId: LOCAL_TEAM_ID,
  visitorId: VISITOR_TEAM_ID,
  localScore: 0,
  visitorScore: 0,
  categoryId: CATEGORY_ID,
  penaltyShootout: null,
  ...overrides,
});

const expectedUpsert = ({
  teamId,
  opponentGoals,
  goals,
  points,
  additionalPoints,
  wins,
  draws,
  losses,
}: {
  teamId: string;
  goals: number;
  opponentGoals: number;
  points: number;
  additionalPoints: number;
  wins: number;
  draws: number;
  losses: number;
}) => ({
  where: {
    tournamentId_teamId_categoryId: {
      tournamentId: TOURNAMENT_ID,
      teamId,
      categoryId: CATEGORY_ID,
    },
  },
  create: {
    teamId,
    tournamentId: TOURNAMENT_ID,
    categoryId: CATEGORY_ID,
    matchesPlayed: 1,
    wins,
    draws,
    losses,
    goalsFor: goals,
    goalsAgainst: opponentGoals,
    goalsDifference: goals - opponentGoals,
    points,
    additionalPoints,
    totalPoints: points + additionalPoints,
  },
  update: {
    matchesPlayed: { increment: 1 },
    wins: { increment: wins },
    draws: { increment: draws },
    losses: { increment: losses },
    goalsFor: { increment: goals },
    goalsAgainst: { increment: opponentGoals },
    goalsDifference: { increment: goals - opponentGoals },
    points: { increment: points },
    additionalPoints: { increment: additionalPoints },
    totalPoints: { increment: points + additionalPoints },
  },
});

describe('Tests on recalculateStandingsAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => { });
    vi.spyOn(console, 'log').mockImplementation(() => { });
    mockGetSession.mockResolvedValue({
      user: { id: ADMIN_USER_ID, roles: ['admin'] },
    });
    mockTeamFindMany.mockResolvedValue([
      { id: LOCAL_TEAM_ID },
      { id: VISITOR_TEAM_ID },
    ]);
    mockTx.standings.deleteMany.mockResolvedValue({ count: 2 });
    mockTx.standings.createMany.mockResolvedValue({ count: 2 });
    mockTx.standings.upsert.mockResolvedValue({});
    mockTx.match.findMany.mockResolvedValue([]);
    mockTransaction.mockImplementation(
      (cb: (tx: typeof mockTx) => unknown) => cb(mockTx),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Authentication', () => {
    test('Should return error when there is no session', async () => {
      mockGetSession.mockResolvedValue(null);

      const response = await recalculateStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(response.ok).toBe(false);
      expect(response.message).toMatch(/debes estar autentificado/i);
      expect(mockTransaction).not.toHaveBeenCalled();
    });

    test('Should return error when user is not admin', async () => {
      mockGetSession.mockResolvedValue({
        user: { id: ADMIN_USER_ID, roles: ['user'] },
      });

      const response = await recalculateStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(response.ok).toBe(false);
      expect(response.message).toMatch(/permisos administrativos/i);
      expect(mockTransaction).not.toHaveBeenCalled();
    });

    test('Should return error when roles are null', async () => {
      mockGetSession.mockResolvedValue({
        user: { id: ADMIN_USER_ID, roles: null },
      });

      const response = await recalculateStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(response.ok).toBe(false);
      expect(response.message).toMatch(/permisos administrativos/i);
      expect(mockTransaction).not.toHaveBeenCalled();
    });

    test('Should return error when roles are empty', async () => {
      mockGetSession.mockResolvedValue({
        user: { id: ADMIN_USER_ID, roles: [] },
      });

      const response = await recalculateStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(response.ok).toBe(false);
      expect(response.message).toMatch(/permisos administrativos/i);
      expect(mockTransaction).not.toHaveBeenCalled();
    });
  });

  describe('Teams', () => {
    test('Should return error when the tournament has no teams', async () => {
      mockTeamFindMany.mockResolvedValue([]);

      const response = await recalculateStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(response.ok).toBe(false);
      expect(response.message).toMatch(/no hay equipos/i);
      expect(mockTransaction).not.toHaveBeenCalled();
      expect(mockTx.standings.createMany).not.toHaveBeenCalled();
    });

    test('Should return an error when the teams query fails', async () => {
      mockTeamFindMany.mockRejectedValue(new Error('DB connection lost'));

      const response = await recalculateStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(response.ok).toBe(false);
      expect(response.message).toMatch(/error al recalcular las estadísticas/i);
      expect(mockTransaction).not.toHaveBeenCalled();
    });

    test('Should query teams by tournament and category', async () => {
      await recalculateStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(mockTeamFindMany).toHaveBeenCalledWith({
        where: { tournamentId: TOURNAMENT_ID, categoryId: CATEGORY_ID },
        select: { id: true },
      });
    });

    test('Should create standings for every team with zeroed counters', async () => {
      await recalculateStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(mockTx.standings.createMany).toHaveBeenCalledWith({
        data: [
          {
            teamId: LOCAL_TEAM_ID,
            tournamentId: TOURNAMENT_ID,
            categoryId: CATEGORY_ID,
            matchesPlayed: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalsDifference: 0,
            points: 0,
            additionalPoints: 0,
            totalPoints: 0,
          },
          {
            teamId: VISITOR_TEAM_ID,
            tournamentId: TOURNAMENT_ID,
            categoryId: CATEGORY_ID,
            matchesPlayed: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalsDifference: 0,
            points: 0,
            additionalPoints: 0,
            totalPoints: 0,
          },
        ],
      });
    });
  });

  describe('Previous standings', () => {
    test('Should recalculate even when no previous standings existed', async () => {
      mockTx.standings.deleteMany.mockResolvedValue({ count: 0 });
      mockTx.match.findMany.mockResolvedValue([
        completedMatch({ localScore: 2, visitorScore: 0 }),
      ]);

      const response = await recalculateStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(response.ok).toBe(true);
      expect(response.message).toContain('recalcularon correctamente');
      expect(mockTx.standings.deleteMany).toHaveBeenCalledWith({
        where: { tournamentId: TOURNAMENT_ID, categoryId: CATEGORY_ID },
      });
      expect(mockTx.standings.upsert).toHaveBeenCalledTimes(2);
    });
  });

  describe('Completed matches', () => {
    test('Should only read completed matches of the tournament and category', async () => {
      await recalculateStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(mockTx.match.findMany).toHaveBeenCalledWith({
        where: {
          tournamentId: TOURNAMENT_ID,
          categoryId: CATEGORY_ID,
          status: 'completed',
        },
        select: {
          localId: true,
          visitorId: true,
          localScore: true,
          visitorScore: true,
          categoryId: true,
          penaltyShootout: {
            where: { status: 'completed' },
            select: { winnerTeamId: true },
          },
        },
      });
    });

    test('Should award 3 points to the local team when it wins (Games Played, Wins, Losses, Goals)', async () => {
      mockTx.match.findMany.mockResolvedValue([
        completedMatch({ localScore: 3, visitorScore: 2 }),
      ]);

      const response = await recalculateStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(response.ok).toBe(true);

      const localUpsert = expectedUpsert({
        teamId: LOCAL_TEAM_ID,
        goals: 3,
        opponentGoals: 2,
        points: 3,
        additionalPoints: 0,
        wins: 1,
        draws: 0,
        losses: 0,
      });
      expect(mockTx.standings.upsert).toHaveBeenNthCalledWith(1, localUpsert);

      const visitorUpsert = expectedUpsert({
        teamId: VISITOR_TEAM_ID,
        goals: 2,
        opponentGoals: 3,
        points: 0,
        additionalPoints: 0,
        wins: 0,
        draws: 0,
        losses: 1,
      });
      expect(mockTx.standings.upsert).toHaveBeenNthCalledWith(2, visitorUpsert);
    });

    test('Should award 3 points to the visitor team when it wins', async () => {
      mockTx.match.findMany.mockResolvedValue([
        completedMatch({ localScore: 0, visitorScore: 2 }),
      ]);

      await recalculateStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      const localUpsert = expectedUpsert({
        teamId: LOCAL_TEAM_ID,
        goals: 0,
        opponentGoals: 2,
        points: 0,
        additionalPoints: 0,
        wins: 0,
        draws: 0,
        losses: 1,
      });
      expect(mockTx.standings.upsert).toHaveBeenNthCalledWith(1, localUpsert);

      const visitorUpsert = expectedUpsert({
        teamId: VISITOR_TEAM_ID,
        goals: 2,
        opponentGoals: 0,
        points: 3,
        additionalPoints: 0,
        wins: 1,
        draws: 0,
        losses: 0,
      });
      expect(mockTx.standings.upsert).toHaveBeenNthCalledWith(2, visitorUpsert);
    });

    test('Should award 1 point to each team when the match is a draw', async () => {
      mockTx.match.findMany.mockResolvedValue([
        completedMatch({ localScore: 1, visitorScore: 1 }),
      ]);

      await recalculateStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      const localUpsert = expectedUpsert({
        teamId: LOCAL_TEAM_ID,
        goals: 1,
        opponentGoals: 1,
        points: 1,
        additionalPoints: 0,
        wins: 0,
        draws: 1,
        losses: 0,
      });
      expect(mockTx.standings.upsert).toHaveBeenNthCalledWith(1, localUpsert);

      const visitorUpsert = expectedUpsert({
        teamId: VISITOR_TEAM_ID,
        goals: 1,
        opponentGoals: 1,
        points: 1,
        additionalPoints: 0,
        wins: 0,
        draws: 1,
        losses: 0,
      });
      expect(mockTx.standings.upsert).toHaveBeenNthCalledWith(2, visitorUpsert);
    });

    test('Should award an additional point to the local team when it wins the shootout', async () => {
      mockTx.match.findMany.mockResolvedValue([
        completedMatch({
          localScore: 1,
          visitorScore: 1,
          penaltyShootout: { winnerTeamId: LOCAL_TEAM_ID },
        }),
      ]);

      await recalculateStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      const localUpsert = expectedUpsert({
        teamId: LOCAL_TEAM_ID,
        goals: 1,
        opponentGoals: 1,
        points: 1,
        additionalPoints: 1,
        wins: 0,
        draws: 1,
        losses: 0,
      });
      expect(mockTx.standings.upsert).toHaveBeenNthCalledWith(1, localUpsert);

      const visitorUpsert = expectedUpsert({
        teamId: VISITOR_TEAM_ID,
        goals: 1,
        opponentGoals: 1,
        points: 1,
        additionalPoints: 0,
        wins: 0,
        draws: 1,
        losses: 0,
      });
      expect(mockTx.standings.upsert).toHaveBeenNthCalledWith(2, visitorUpsert);
    });

    test('Should award an additional point to the visitor team when it wins the shootout', async () => {
      mockTx.match.findMany.mockResolvedValue([
        completedMatch({
          localScore: 2,
          visitorScore: 2,
          penaltyShootout: { winnerTeamId: VISITOR_TEAM_ID },
        }),
      ]);

      await recalculateStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      const localUpsert = expectedUpsert({
        teamId: LOCAL_TEAM_ID,
        goals: 2,
        opponentGoals: 2,
        points: 1,
        additionalPoints: 0,
        wins: 0,
        draws: 1,
        losses: 0,
      });
      expect(mockTx.standings.upsert).toHaveBeenNthCalledWith(1, localUpsert);

      const visitorUpsert = expectedUpsert({
        teamId: VISITOR_TEAM_ID,
        goals: 2,
        opponentGoals: 2,
        points: 1,
        additionalPoints: 1,
        wins: 0,
        draws: 1,
        losses: 0,
      });
      expect(mockTx.standings.upsert).toHaveBeenNthCalledWith(2, visitorUpsert);
    });

    test('Should accumulate counters when a team plays several matches', async () => {
      mockTx.match.findMany.mockResolvedValue([
        completedMatch({ localScore: 3, visitorScore: 0 }),
        completedMatch({ localScore: 1, visitorScore: 1 }),
      ]);

      await recalculateStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(mockTx.standings.upsert).toHaveBeenCalledTimes(4);
      expect(mockTx.standings.upsert).toHaveBeenNthCalledWith(3, expect.objectContaining({
        update: expect.objectContaining({
          matchesPlayed: { increment: 1 },
          draws: { increment: 1 },
          points: { increment: 1 },
        }),
      }));
    });
  });

  describe('Transaction', () => {
    test('Should run inside a transaction with a wider timeout', async () => {
      await recalculateStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(mockTransaction).toHaveBeenCalledWith(expect.any(Function), {
        maxWait: 5000,
        timeout: 20000,
      });
    });

    test('Should return error on unexpected non-error value', async () => {
      mockTransaction.mockRejectedValue('Something unexpected');

      const response = await recalculateStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(response.ok).toBe(false);
      expect(response.message).toMatch(/error al recalcular las estadísticas/i);
    });
  });
});
