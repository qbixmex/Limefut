const { MockPrismaClientKnownRequestError, mockUpdate, mockGetSession } = vi.hoisted(() => {
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
    mockUpdate: vi.fn(),
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
    match: { update: mockUpdate },
  },
}));

vi.mock('@/generated/prisma/client', () => ({
  Prisma: {
    PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
  },
}));

import { updateStatusAction } from '@/app/admin/encuentros/(actions)/update-status.action';
import { MATCH_STATUS } from '@/shared/enums';

const matchId = '0251b9bf-55e5-48fb-ae2c-6fcdad308d13';

describe('Tests on updateStatusAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => { });
    mockGetSession.mockResolvedValue({
      user: { id: 'b7e2ca32-af95-4750-bf63-6a338b236097', roles: ['admin'] },
    });
    mockUpdate.mockResolvedValue({ id: matchId });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await updateStatusAction(matchId, MATCH_STATUS.IN_PROGRESS);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c45414c0-044b-4319-acbb-45584a0839fa', roles: ['user'] },
    });

    const response = await updateStatusAction(matchId, MATCH_STATUS.IN_PROGRESS);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should update the match status', async () => {
    const response = await updateStatusAction(matchId, MATCH_STATUS.IN_PROGRESS);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/estado del partido fue actualizado/i);
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: matchId },
      data: { status: MATCH_STATUS.IN_PROGRESS },
    });
  });

  test('Should return error when the status could not be updated', async () => {
    mockUpdate.mockResolvedValue(null);

    const response = await updateStatusAction(matchId, MATCH_STATUS.IN_PROGRESS);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No se pudo actualizar el estado del partido');
  });

  test('Should return a "not found" error on missing records (P2001)', async () => {
    mockUpdate.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Record not found', {
        code: 'P2001',
        meta: { modelName: 'Match', target: ['id'] },
      }),
    );

    const response = await updateStatusAction(matchId, MATCH_STATUS.IN_PROGRESS);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/el campo "id" no existe/i);
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockUpdate.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: { modelName: 'Match', target: ['id'] },
      }),
    );

    const response = await updateStatusAction(matchId, MATCH_STATUS.IN_PROGRESS);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/el campo "id" está duplicado/i);
  });

  test('Should return a generic prisma error for other codes', async () => {
    mockUpdate.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
        meta: { modelName: 'Match' },
      }),
    );

    const response = await updateStatusAction(matchId, MATCH_STATUS.IN_PROGRESS);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error al actualizar el estado del partido/i);
  });

  test('Should return an error on unexpected Error instance', async () => {
    mockUpdate.mockRejectedValue(new Error('Something went wrong'));

    const response = await updateStatusAction(matchId, MATCH_STATUS.IN_PROGRESS);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
  });
});
