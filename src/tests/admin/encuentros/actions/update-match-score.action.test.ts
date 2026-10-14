const {
  MockPrismaClientKnownRequestError,
  mockMatchFindFirst,
  mockMatchUpdate,
  mockStandingsFindMany,
  mockStandingsUpdate,
  mockTransaction,
  mockTx,
  mockGetSession,
} = vi.hoisted(() => {
  class MockPrismaClientKnownRequestError extends Error {
    code: string;
    meta?: Record<string, unknown>;
    constructor(
      message: string,
      options: { code: string; meta?: Record<string, unknown> },
    ) {
      super(message);
      this.name = 'PrismaClientKnownRequestError';
      this.code = options.code;
      this.meta = options.meta;
    }
  }

  const mockTx = {
    match: { update: vi.fn() },
    standings: { update: vi.fn() },
  };

  return {
    MockPrismaClientKnownRequestError,
    mockMatchFindFirst: vi.fn(),
    mockMatchUpdate: mockTx.match.update,
    mockStandingsFindMany: vi.fn(),
    mockStandingsUpdate: mockTx.standings.update,
    mockTransaction: vi.fn(),
    mockTx,
    mockGetSession: vi.fn(),
  };
});

vi.mock('next/cache');

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
    $transaction: mockTransaction,
    match: { findFirst: mockMatchFindFirst },
    standings: { findMany: mockStandingsFindMany },
  },
}));

vi.mock('@/generated/prisma/client', () => ({
  Prisma: {
    PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
  },
}));

import { updateMatchScoreAction } from '@/app/admin/encuentros/(actions)/update-match-score.action';

const matchId = '0251b9bf-55e5-48fb-ae2c-6fcdad308d13';
const localId = '3f24c2e0-7fd2-46e4-94ba-4dd0b557e675';
const visitorId = '99182b8e-143a-479b-8496-24f283e847ae';

const baseProps = {
  matchId,
  localScore: 2,
  visitorScore: 1,
  localId,
  visitorId,
};

const currentMatch = {
  localScore: 0,
  visitorScore: 0,
  tournamentId: 'f641c5b8-0bcb-4b2c-ab90-27210ba17dac',
  categoryId: '1ff58d74-2761-42f2-8250-2e009937921f',
  mode: 'league',
  tournament: { permalink: 'liga-mx' },
  category: { id: 'c1', name: 'Sub-15', permalink: 'sub-15' },
};

const bothStandings = [
  { id: 'standings-local', teamId: localId },
  { id: 'standings-visitor', teamId: visitorId },
];

describe('Tests on updateMatchScoreAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => { });
    vi.spyOn(console, 'error').mockImplementation(() => { });
    mockGetSession.mockResolvedValue({
      user: { id: 'b7e2ca32-af95-4750-bf63-6a338b236097', roles: ['admin'] },
    });
    mockTransaction.mockImplementation((cb: (tx: typeof mockTx) => unknown) => cb(mockTx));
    mockMatchFindFirst.mockResolvedValue(currentMatch);
    mockStandingsFindMany.mockResolvedValue(bothStandings);
    mockStandingsUpdate.mockResolvedValue({ id: 'standings-id' });
    mockMatchUpdate.mockResolvedValue({
      id: matchId,
      tournament: { id: 'f641c5b8-0bcb-4b2c-ab90-27210ba17dac', permalink: 'liga-mx' },
      category: { id: 'c1', name: 'Sub-15', permalink: 'sub-15' },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await updateMatchScoreAction(baseProps);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when the match does not exist', async () => {
    mockMatchFindFirst.mockResolvedValue(null);

    const response = await updateMatchScoreAction(baseProps);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/partido no encontrado/i);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should revert and reapply standings and update the match', async () => {
    const response = await updateMatchScoreAction(baseProps);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/marcador del partido se actualizó correctamente/i);
    expect(mockStandingsUpdate).toHaveBeenCalledTimes(4);
    expect(mockMatchUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: matchId },
        data: { localScore: 2, visitorScore: 1, status: 'completed' },
      }),
    );
  });

  test('Should revert and reapply using the resolved standings ids', async () => {
    const response = await updateMatchScoreAction(baseProps);

    expect(response.ok).toBe(true);
    expect(mockStandingsUpdate).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ where: { id: 'standings-local' } }),
    );
    expect(mockStandingsUpdate).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ where: { id: 'standings-visitor' } }),
    );
    expect(mockStandingsUpdate).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ where: { id: 'standings-local' } }),
    );
    expect(mockStandingsUpdate).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({ where: { id: 'standings-visitor' } }),
    );
  });

  test('Should not touch the standings when the match is friendly', async () => {
    mockMatchFindFirst.mockResolvedValue({ ...currentMatch, mode: 'friendly' });

    const response = await updateMatchScoreAction(baseProps);

    expect(response.ok).toBe(true);
    expect(mockStandingsFindMany).not.toHaveBeenCalled();
    expect(mockStandingsUpdate).not.toHaveBeenCalled();
    expect(mockMatchUpdate).toHaveBeenCalledTimes(1);
  });

  test('Should revert a previous 0-0 draw with one point for each team', async () => {
    const response = await updateMatchScoreAction(baseProps);

    expect(response.ok).toBe(true);
    expect(mockStandingsUpdate).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        data: expect.objectContaining({
          draws: { decrement: 1 },
          wins: { decrement: 0 },
          losses: { decrement: 0 },
          points: { decrement: 1 },
        }),
      }),
    );
  });

  test('Should return error and write nothing when the local standings row is missing', async () => {
    mockStandingsFindMany.mockResolvedValue([
      { id: 'standings-visitor', teamId: visitorId },
    ]);

    const response = await updateMatchScoreAction(baseProps);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/equipo local/i);
    expect(mockTransaction).not.toHaveBeenCalled();
    expect(mockStandingsUpdate).not.toHaveBeenCalled();
    expect(mockMatchUpdate).not.toHaveBeenCalled();
  });

  test('Should return error and write nothing when the visitor standings row is missing', async () => {
    mockStandingsFindMany.mockResolvedValue([
      { id: 'standings-local', teamId: localId },
    ]);

    const response = await updateMatchScoreAction(baseProps);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/equipo visitante/i);
    expect(mockTransaction).not.toHaveBeenCalled();
    expect(mockStandingsUpdate).not.toHaveBeenCalled();
    expect(mockMatchUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when the match could not be updated', async () => {
    mockMatchUpdate.mockResolvedValue(null);

    const response = await updateMatchScoreAction(baseProps);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
  });

  test('Should report a P2001 raised inside the transaction', async () => {
    mockStandingsUpdate.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Record to update not found', {
        code: 'P2001',
      }),
    );

    const response = await updateMatchScoreAction(baseProps);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no existen/i);
  });

  test('Should report duplicate fields on a P2002', async () => {
    mockStandingsUpdate.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: { modelName: 'Match', target: ['matchId'] },
      }),
    );

    const response = await updateMatchScoreAction(baseProps);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/hay campos duplicados/i);
    expect(response.message).not.toMatch(/matchId/i);
  });

  test('Should fall back to a generic message on other prisma codes', async () => {
    mockMatchUpdate.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
        meta: { modelName: 'Match' },
      }),
    );

    const response = await updateMatchScoreAction(baseProps);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error al actualizar el marcador del partido/i);
  });

  test('Should return an error on unexpected failures', async () => {
    mockMatchFindFirst.mockRejectedValue(new Error('DB exploded'));

    const response = await updateMatchScoreAction(baseProps);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.currentMatch).toBe(null);
  });
});
