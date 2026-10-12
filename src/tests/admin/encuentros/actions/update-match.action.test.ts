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
  },
}));

vi.mock('@/generated/prisma/client', () => ({
  Prisma: {
    PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
  },
}));

import { updateMatchAction } from '@/app/admin/encuentros/(actions)/update-match.action';
import { AMERICA, CHIVAS } from '../mocks/teams.mock';
import { LIGA_MX, COPA_POR_MEXICO } from '../mocks/tournaments.mock';
import { SUB_15, SUB_17 } from '../mocks/categories.mock';
import { ESTADIO_AZTECA } from '../mocks/fields.mock';

const matchId = '0251b9bf-55e5-48fb-ae2c-6fcdad308d13';

const validFormData = (): FormData => {
  const formData = new FormData();
  formData.append('localTeamId', AMERICA.id);
  formData.append('visitorTeamId', CHIVAS.id);
  formData.append('fieldId', ESTADIO_AZTECA.id);
  formData.append('localScore', '2');
  formData.append('visitorScore', '1');
  formData.append('referee', 'Fernando García');
  formData.append('status', 'completed');
  formData.append('tournament', LIGA_MX.permalink);
  formData.append('category', SUB_15.permalink);
  formData.append('week', '5');
  return formData;
};

const existingMatch = {
  id: matchId,
  tournament: { id: LIGA_MX.id, permalink: LIGA_MX.permalink },
  category: { id: SUB_15.id, permalink: SUB_15.permalink },
};

const updatedMatch = {
  id: matchId,
  localScore: 2,
  visitorScore: 1,
  matchDate: null,
  week: 5,
  referee: 'Fernando García',
  status: 'completed',
  local: AMERICA,
  visitor: CHIVAS,
  tournament: LIGA_MX,
  category: SUB_15,
};

const mockTx = {
  match: { findFirst: vi.fn(), update: vi.fn() },
  tournament: { findFirst: vi.fn() },
  category: { findFirst: vi.fn() },
};

describe('Tests on updateMatchAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => { });
    mockGetSession.mockResolvedValue({
      user: { id: 'b7e2ca32-af95-4750-bf63-6a338b236097', roles: ['admin'] },
    });
    mockTx.match.findFirst.mockResolvedValue(existingMatch);
    mockTx.tournament.findFirst.mockResolvedValue({ id: COPA_POR_MEXICO.id });
    mockTx.category.findFirst.mockResolvedValue({ id: SUB_17.id });
    mockTx.match.update.mockResolvedValue(updatedMatch);
    mockTransaction.mockImplementation((cb: (tx: typeof mockTx) => unknown) => cb(mockTx));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await updateMatchAction({ matchId, formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return a validation error when the local team is not a UUID', async () => {
    const formData = validFormData();
    formData.set('localTeamId', 'not-a-uuid');

    const response = await updateMatchAction({ matchId, formData });

    expect(response.ok).toBe(false);
    expect(response.match).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when the match does not exist', async () => {
    mockTx.match.findFirst.mockResolvedValue(null);

    const response = await updateMatchAction({ matchId, formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no existe o ha sido eliminado/i);
    expect(mockTx.match.update).not.toHaveBeenCalled();
  });

  test('Should update the match keeping the same tournament and category', async () => {
    const response = await updateMatchAction({ matchId, formData: validFormData() });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/actualizado correctamente/i);
    expect(mockTx.tournament.findFirst).not.toHaveBeenCalled();
    expect(mockTx.category.findFirst).not.toHaveBeenCalled();
    expect(mockTx.match.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: matchId },
        data: expect.objectContaining({ tournamentId: undefined, categoryId: undefined }),
      }),
    );
  });

  test('Should look up a new tournament and category when they change', async () => {
    const formData = validFormData();
    formData.set('tournament', COPA_POR_MEXICO.permalink);
    formData.set('category', SUB_17.permalink);

    await updateMatchAction({ matchId, formData });

    expect(mockTx.tournament.findFirst).toHaveBeenCalledWith({
      where: { permalink: COPA_POR_MEXICO.permalink },
      select: { id: true },
    });
    expect(mockTx.category.findFirst).toHaveBeenCalledWith({
      where: { permalink: SUB_17.permalink },
      select: { id: true },
    });
    expect(mockTx.match.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          tournamentId: COPA_POR_MEXICO.id,
          categoryId: SUB_17.id,
        }),
      }),
    );
  });

  test('Should return error when the new tournament does not exist', async () => {
    mockTx.tournament.findFirst.mockResolvedValue(null);
    const formData = validFormData();
    formData.set('tournament', COPA_POR_MEXICO.permalink);

    const response = await updateMatchAction({ matchId, formData });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no existe/i);
    expect(mockTx.match.update).not.toHaveBeenCalled();
  });

  test('Should return error when the new category does not exist', async () => {
    mockTx.category.findFirst.mockResolvedValue(null);
    const formData = validFormData();
    formData.set('category', SUB_17.permalink);

    const response = await updateMatchAction({ matchId, formData });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no existe/i);
    expect(mockTx.match.update).not.toHaveBeenCalled();
  });

  test('Should return a "not found" error on missing records (P2001)', async () => {
    mockTx.match.update.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Record not found', {
        code: 'P2001',
        meta: { modelName: 'Match', target: ['localId'] },
      }),
    );

    const response = await updateMatchAction({ matchId, formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/el campo "localid" no existe/i);
    expect(response.match).toBe(null);
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockTx.match.update.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: { modelName: 'Match', target: ['localId'] },
      }),
    );

    const response = await updateMatchAction({ matchId, formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/el campo "localid" está duplicado/i);
  });

  test('Should return a generic prisma error for non-P2002 codes', async () => {
    mockTx.match.update.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
        meta: { modelName: 'Match' },
      }),
    );

    const response = await updateMatchAction({ matchId, formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error al actualizar el encuentro/i);
  });

  test('Should return an error on unexpected Error instance', async () => {
    mockTransaction.mockRejectedValue(new Error('Something went wrong'));

    const response = await updateMatchAction({ matchId, formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
  });

  test('Should return an error on unknown error', async () => {
    mockTransaction.mockRejectedValue('Something unexpected');

    const response = await updateMatchAction({ matchId, formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
  });
});
