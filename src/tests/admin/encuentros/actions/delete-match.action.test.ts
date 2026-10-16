const { MockPrismaClientKnownRequestError, mockFindFirst, mockDelete, mockGetSession } =
  vi.hoisted(() => {
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
      mockFindFirst: vi.fn(),
      mockDelete: vi.fn(),
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
    match: {
      findFirst: mockFindFirst,
      delete: mockDelete,
    },
  },
}));

vi.mock('@/generated/prisma/client', () => ({
  Prisma: {
    PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
  },
}));

import { deleteMatchAction } from '@/app/admin/encuentros/(actions)/delete-match.action';

const matchId = '0251b9bf-55e5-48fb-ae2c-6fcdad308d13';

describe('Tests on deleteMatchAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => { });
    mockGetSession.mockResolvedValue({
      user: { id: 'b7e2ca32-af95-4750-bf63-6a338b236097', roles: ['admin'] },
    });
    mockFindFirst.mockResolvedValue({ id: matchId });
    mockDelete.mockResolvedValue({ id: matchId });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await deleteMatchAction(matchId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c45414c0-044b-4319-acbb-45584a0839fa', roles: ['user'] },
    });

    const response = await deleteMatchAction(matchId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when the match does not exist', async () => {
    mockFindFirst.mockResolvedValue(null);

    const response = await deleteMatchAction(matchId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no se puede eliminar/i);
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should delete the match successfully', async () => {
    const response = await deleteMatchAction(matchId);

    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { id: matchId },
    });
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: matchId } });
    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/eliminado correctamente/i);
  });

  test('Should return a "not found" error on missing records (P2001)', async () => {
    mockDelete.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Record not found', {
        code: 'P2001',
        meta: { modelName: 'Match', target: ['id'] },
      }),
    );

    const response = await deleteMatchAction(matchId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/el campo "id" no existe/i);
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockDelete.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: { modelName: 'Match', target: ['id'] },
      }),
    );

    const response = await deleteMatchAction(matchId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/el campo "id" está duplicado/i);
  });

  test('Should return a generic prisma error for other codes', async () => {
    mockDelete.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
        meta: { modelName: 'Match' },
      }),
    );

    const response = await deleteMatchAction(matchId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error al eliminar el encuentro/i);
  });

  test('Should return an error on unexpected Error instance', async () => {
    mockDelete.mockRejectedValue(new Error('Something went wrong'));

    const response = await deleteMatchAction(matchId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
  });
});
