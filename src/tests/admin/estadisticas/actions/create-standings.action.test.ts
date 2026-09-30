const {
  MockPrismaClientKnownRequestError,
  mockTransaction,
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
  return {
    MockPrismaClientKnownRequestError,
    mockTransaction: vi.fn(),
    mockGetSession: vi.fn(),
  };
});

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
    $transaction: mockTransaction,
  },
}));

vi.mock('@/generated/prisma/client', () => ({
  Prisma: {
    PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
  },
}));

import { createStandingsAction } from '@/app/admin/estadisticas/(actions)/create-standings.action';
import {
  ADMIN_USER_ID,
  CATEGORY_ID,
  LOCAL_TEAM_ID,
  TOURNAMENT_ID,
  VISITOR_TEAM_ID,
} from '../mocks/standings.mock';

const validStandings = () => [
  {
    tournamentId: TOURNAMENT_ID,
    categoryId: CATEGORY_ID,
    teamId: LOCAL_TEAM_ID,
  },
  {
    tournamentId: TOURNAMENT_ID,
    categoryId: CATEGORY_ID,
    teamId: VISITOR_TEAM_ID,
  },
];

const mockTx = {
  standings: {
    createMany: vi.fn(),
  },
};

describe('Tests on createStandingsAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => { });
    mockGetSession.mockResolvedValue({
      user: { id: ADMIN_USER_ID, roles: ['admin'] },
    });
    mockTx.standings.createMany.mockResolvedValue({ count: 2 });
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

      const response = await createStandingsAction(validStandings());

      expect(response.ok).toBe(false);
      expect(response.message).toBe('¡ Debes estar autentificado para realizar esta acción !');
      expect(mockTransaction).not.toHaveBeenCalled();
    });

    test('Should return error when user is not admin', async () => {
      mockGetSession.mockResolvedValue({
        user: { id: ADMIN_USER_ID, roles: ['user'] },
      });

      const response = await createStandingsAction(validStandings());

      expect(response.ok).toBe(false);
      expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
      expect(mockTransaction).not.toHaveBeenCalled();
    });

    test('Should return error when roles are null', async () => {
      mockGetSession.mockResolvedValue({
        user: { id: ADMIN_USER_ID, roles: null },
      });

      const response = await createStandingsAction(validStandings());

      expect(response.ok).toBe(false);
      expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
      expect(mockTransaction).not.toHaveBeenCalled();
    });

    test('Should return error when roles are empty', async () => {
      mockGetSession.mockResolvedValue({
        user: { id: ADMIN_USER_ID, roles: [] },
      });

      const response = await createStandingsAction(validStandings());

      expect(response.ok).toBe(false);
      expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
      expect(mockTransaction).not.toHaveBeenCalled();
    });
  });

  describe('Validation', () => {
    test('Should return an error when a tournament id is not a valid uuid', async () => {
      const invalidStandings = [
        {
          tournamentId: 'not-a-uuid',
          categoryId: CATEGORY_ID,
          teamId: LOCAL_TEAM_ID,
        },
      ];

      const response = await createStandingsAction(invalidStandings);

      expect(response.ok).toBe(false);
      expect(response.message).toMatch(/uuid/i);
      expect(mockTransaction).not.toHaveBeenCalled();
    });

    test('Should return an error when a team id is not a valid uuid', async () => {
      const invalidStandings = [
        {
          tournamentId: TOURNAMENT_ID,
          categoryId: CATEGORY_ID,
          teamId: 'not-a-uuid',
        },
      ];

      const response = await createStandingsAction(invalidStandings);

      expect(response.ok).toBe(false);
      expect(response.message).toMatch(/uuid/i);
      expect(mockTransaction).not.toHaveBeenCalled();
    });
  });

  describe('Creation', () => {
    test('Should create the standings successfully', async () => {
      const response = await createStandingsAction(validStandings());

      expect(response.ok).toBe(true);
      expect(response.message).toMatch(/creadas correctamente/i);
      expect(mockTx.standings.createMany).toHaveBeenCalledWith({
        data: validStandings(),
      });
    });

    test('Should return an error when the field is duplicated (P2002)', async () => {
      mockTransaction.mockRejectedValue(
        new MockPrismaClientKnownRequestError('Unique constraint failed', {
          code: 'P2002',
          meta: { modelName: 'Standings', target: ['tournamentId'] },
        }),
      );

      const response = await createStandingsAction(validStandings());

      expect(response.ok).toBe(false);
      expect(response.message).toMatch(/campos duplicados/i);
    });

    test('Should return error on unexpected non-error value', async () => {
      mockTransaction.mockRejectedValue('Something unexpected');

      const response = await createStandingsAction(validStandings());

      expect(response.ok).toBe(false);
      expect(response.message).toMatch(/error inesperado/i);
    });
  });
});
