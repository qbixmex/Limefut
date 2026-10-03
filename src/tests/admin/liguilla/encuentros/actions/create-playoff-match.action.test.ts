const {
  MockPrismaClientKnownRequestError,
  mockTransaction,
  mockCount,
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
    mockCount: vi.fn(),
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
    playoff: { count: mockCount },
    $transaction: mockTransaction,
  },
}));

vi.mock('@prisma/client/runtime/client', () => ({
  PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
}));

import { createPlayoffMatchAction } from '@/app/admin/liguilla/[playoff_id]/encuentros/(actions)/create-playoff-match.action';

const playoffId = '376ec9ed-fd25-4d92-ad26-35b7a354eab1';
const localTeamId = '3a4b5c6d-7e8f-4a9b-8c1d-2e3f4a5b6c7d';
const visitorTeamId = '4b5c6d7e-8f9a-4b1c-9d2e-3f4a5b6c7d8e';
const fieldId = '9a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d';
const matchId = '6d7e8f9a-1b2c-4d3e-8f4a-5b6c7d8e9f0a';

const validFormData = (group = 'gold'): FormData => {
  const formData = new FormData();
  formData.append('localTeamId', localTeamId);
  formData.append('visitorTeamId', visitorTeamId);
  formData.append('fieldId', fieldId);
  formData.append('localTeamScore', '0');
  formData.append('visitorTeamScore', '0');
  formData.append('round', 'quarterfinal');
  formData.append('group', group);
  formData.append('status', 'scheduled');
  return formData;
};

const mockTx = {
  playoffMatch: { create: vi.fn() },
};

describe('Tests on createPlayoffMatchAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => { });
    mockGetSession.mockResolvedValue({
      user: { id: 'b7e2ca32-af95-4750-bf63-6a338b236097', roles: ['admin'] },
    });
    mockCount.mockResolvedValue(1);
    mockTx.playoffMatch.create.mockResolvedValue({ id: matchId });
    mockTransaction.mockImplementation((cb: (tx: typeof mockTx) => unknown) => cb(mockTx));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await createPlayoffMatchAction({
      playoffId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(response.match).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c45414c0-044b-4319-acbb-45584a0839fa', roles: ['user'] },
    });

    const response = await createPlayoffMatchAction({
      playoffId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return a validation error when required fields are missing', async () => {
    const formData = validFormData();
    formData.delete('localTeamId');

    const response = await createPlayoffMatchAction({ playoffId, formData });

    expect(response.ok).toBe(false);
    expect(response.match).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when the playoff does not exist', async () => {
    mockCount.mockResolvedValue(0);

    const response = await createPlayoffMatchAction({
      playoffId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no se encontró la liguilla/i);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should create a gold group match with position 1', async () => {
    const response = await createPlayoffMatchAction({
      playoffId,
      formData: validFormData('gold'),
    });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/encuentro creado correctamente/i);
    expect(response.match).toEqual({ id: matchId });
    expect(mockTx.playoffMatch.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          playoffId,
          position: 1,
          localId: localTeamId,
          visitorId: visitorTeamId,
          group: 'gold',
          round: 'quarterfinal',
          status: 'scheduled',
        }),
        select: { id: true },
      }),
    );
  });

  test('Should create a silver group match with position 2', async () => {
    await createPlayoffMatchAction({
      playoffId,
      formData: validFormData('silver'),
    });

    expect(mockTx.playoffMatch.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ position: 2, group: 'silver' }),
      }),
    );
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockTransaction.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: { modelName: 'PlayoffMatch' },
      }),
    );

    const response = await createPlayoffMatchAction({
      playoffId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/campos duplicados/i);
    expect(response.match).toBe(null);
  });

  test('Should return a generic prisma error for non-P2002 codes', async () => {
    mockTransaction.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
        meta: { modelName: 'PlayoffMatch' },
      }),
    );

    const response = await createPlayoffMatchAction({
      playoffId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error al crear el encuentro/i);
    expect(response.match).toBe(null);
  });

  test('Should return error on unexpected Error instance', async () => {
    mockTransaction.mockRejectedValue(new Error('Something went wrong'));

    const response = await createPlayoffMatchAction({
      playoffId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error al crear/i);
    expect(response.match).toBe(null);
  });

  test('Should return error on unknown error', async () => {
    mockTransaction.mockRejectedValue('Something unexpected');

    const response = await createPlayoffMatchAction({
      playoffId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.match).toBe(null);
  });
});
