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

vi.mock('@prisma/client/runtime/client', () => ({
  PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
}));

import { updatePlayoffMatchAction } from '@/app/admin/liguilla/[playoff_id]/encuentros/(actions)/update-playoff-match.action';

const matchId = '6d7e8f9a-1b2c-4d3e-8f4a-5b6c7d8e9f0a';
const localTeamId = '3a4b5c6d-7e8f-4a9b-8c1d-2e3f4a5b6c7d';
const visitorTeamId = '4b5c6d7e-8f9a-4b1c-9d2e-3f4a5b6c7d8e';
const fieldId = '9a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d';

const validFormData = (group = 'gold'): FormData => {
  const formData = new FormData();
  formData.append('localTeamId', localTeamId);
  formData.append('visitorTeamId', visitorTeamId);
  formData.append('fieldId', fieldId);
  formData.append('localTeamScore', '2');
  formData.append('visitorTeamScore', '1');
  formData.append('round', 'quarterfinal');
  formData.append('group', group);
  formData.append('status', 'scheduled');
  return formData;
};

const mockTx = {
  playoffMatch: {
    count: vi.fn(),
    update: vi.fn(),
  },
};

describe('Tests on updatePlayoffMatchAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => { });
    mockGetSession.mockResolvedValue({
      user: { id: 'b7e2ca32-af95-4750-bf63-6a338b236097', roles: ['admin'] },
    });
    mockTx.playoffMatch.count.mockResolvedValue(1);
    mockTx.playoffMatch.update.mockResolvedValue({ id: matchId });
    mockTransaction.mockImplementation((cb: (tx: typeof mockTx) => unknown) => cb(mockTx));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await updatePlayoffMatchAction({
      matchId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return a validation error when a field is invalid', async () => {
    const formData = validFormData();
    formData.set('localTeamId', 'not-a-uuid');

    const response = await updatePlayoffMatchAction({ matchId, formData });

    expect(response.ok).toBe(false);
    expect(response.match).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when the match does not exist', async () => {
    mockTx.playoffMatch.count.mockResolvedValue(0);

    const response = await updatePlayoffMatchAction({
      matchId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no existe o ha sido eliminado/i);
    expect(mockTx.playoffMatch.update).not.toHaveBeenCalled();
  });

  test('Should update the match and set the local team as winner', async () => {
    const response = await updatePlayoffMatchAction({
      matchId,
      formData: validFormData('gold'),
    });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/encuentro fue actualizado correctamente/i);
    expect(mockTx.playoffMatch.update).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: { id: matchId },
        data: expect.objectContaining({ position: 1, group: 'gold' }),
      }),
    );
    expect(mockTx.playoffMatch.update).toHaveBeenNthCalledWith(2, {
      where: { id: matchId },
      data: { winnerId: localTeamId },
    });
  });

  test('Should set silver position for a silver group', async () => {
    await updatePlayoffMatchAction({
      matchId,
      formData: validFormData('silver'),
    });

    expect(mockTx.playoffMatch.update).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        data: expect.objectContaining({ position: 2, group: 'silver' }),
      }),
    );
  });

  test('Should set a null winner on a draw', async () => {
    const formData = validFormData();
    formData.set('localTeamScore', '2');
    formData.set('visitorTeamScore', '2');

    await updatePlayoffMatchAction({ matchId, formData });

    expect(mockTx.playoffMatch.update).toHaveBeenNthCalledWith(2, {
      where: { id: matchId },
      data: { winnerId: null },
    });
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockTx.playoffMatch.update.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: { modelName: 'PlayoffMatch' },
      }),
    );

    const response = await updatePlayoffMatchAction({
      matchId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/campos duplicados/i);
  });

  test('Should return a generic prisma error for non-P2002 codes', async () => {
    mockTx.playoffMatch.update.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
        meta: { modelName: 'PlayoffMatch' },
      }),
    );

    const response = await updatePlayoffMatchAction({
      matchId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error al crear el encuentro/i);
  });

  test('Should return error on unexpected Error instance', async () => {
    mockTransaction.mockRejectedValue(new Error('Something went wrong'));

    const response = await updatePlayoffMatchAction({
      matchId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
  });

  test('Should return error on unknown error', async () => {
    mockTransaction.mockRejectedValue('Something unexpected');

    const response = await updatePlayoffMatchAction({
      matchId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
  });
});
