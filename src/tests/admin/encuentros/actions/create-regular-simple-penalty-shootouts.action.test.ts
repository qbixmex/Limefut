const { MockPrismaClientKnownRequestError, mockTransaction, mockGetSession } = vi.hoisted(() => {
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

import { createRegularSimplePenaltyShootoutAction } from '@/app/admin/encuentros/(actions)/create-regular-simple-penalty-shootouts.action';
import { AMERICA, CHIVAS } from '../mocks/teams.mock';

const matchId = '0251b9bf-55e5-48fb-ae2c-6fcdad308d13';
const shootoutId = 'b2f343d3-5936-4e83-9bcf-6ffa150d9dc3';

const validFormData = (localGoals = '4', visitorGoals = '3'): FormData => {
  const formData = new FormData();
  formData.append('matchId', matchId);
  formData.append('localTeamId', AMERICA.id);
  formData.append('visitorTeamId', CHIVAS.id);
  formData.append('localGoals', localGoals);
  formData.append('visitorGoals', visitorGoals);
  return formData;
};

const mockTx = {
  match: { count: vi.fn() },
  penaltyShootout: { create: vi.fn() },
};

describe('Tests on createRegularSimplePenaltyShootoutAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => { });
    mockGetSession.mockResolvedValue({
      user: { id: 'b7e2ca32-af95-4750-bf63-6a338b236097', roles: ['admin'] },
    });
    mockTx.match.count.mockResolvedValue(1);
    mockTx.penaltyShootout.create.mockResolvedValue({
      id: shootoutId,
      matchId,
      localTeamId: AMERICA.id,
      visitorTeamId: CHIVAS.id,
      localGoals: 4,
      visitorGoals: 3,
      winnerTeamId: AMERICA.id,
      status: 'completed',
    });
    mockTransaction.mockImplementation((cb: (tx: typeof mockTx) => unknown) => cb(mockTx));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await createRegularSimplePenaltyShootoutAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return a validation error when goals are missing', async () => {
    const formData = validFormData();
    formData.delete('localGoals');

    const response = await createRegularSimplePenaltyShootoutAction(formData);

    expect(response.ok).toBe(false);
    expect(response.penaltyShootout).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should reject a draw shootout', async () => {
    const response = await createRegularSimplePenaltyShootoutAction(validFormData('3', '3'));

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no puede ser un empate/i);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when the match does not exist', async () => {
    mockTx.match.count.mockResolvedValue(0);

    const response = await createRegularSimplePenaltyShootoutAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no existe/i);
    expect(mockTx.penaltyShootout.create).not.toHaveBeenCalled();
  });

  test('Should create the shootout with the local team as winner', async () => {
    const response = await createRegularSimplePenaltyShootoutAction(validFormData());

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/tanda de penales creada correctamente/i);
    expect(mockTx.penaltyShootout.create).toHaveBeenCalledWith({
      data: {
        matchId,
        localTeamId: AMERICA.id,
        visitorTeamId: CHIVAS.id,
        localGoals: 4,
        visitorGoals: 3,
        winnerTeamId: AMERICA.id,
        status: 'completed',
      },
    });
  });

  test('Should set the visitor team as winner when it scores more', async () => {
    await createRegularSimplePenaltyShootoutAction(validFormData('2', '5'));

    expect(mockTx.penaltyShootout.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ winnerTeamId: CHIVAS.id }),
      }),
    );
  });

  test('Should return a "not found" error on missing records (P2001)', async () => {
    mockTransaction.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Record not found', {
        code: 'P2001',
        meta: { modelName: 'PenaltyShootout', target: ['matchId'] },
      }),
    );

    const response = await createRegularSimplePenaltyShootoutAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/la tanda de penales no existe/i);
    expect(response.penaltyShootout).toBe(null);
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockTransaction.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: { modelName: 'PenaltyShootout', target: ['matchId'] },
      }),
    );

    const response = await createRegularSimplePenaltyShootoutAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/hay campos duplicados/i);
    expect(response.message).not.toMatch(/matchId/i);
    expect(response.penaltyShootout).toBe(null);
  });

  test('Should return a generic error on other prisma codes', async () => {
    mockTransaction.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
        meta: { modelName: 'PenaltyShootout' },
      }),
    );

    const response = await createRegularSimplePenaltyShootoutAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error al crear la tanda de penales/i);
  });

  test('Should return an error on unexpected failures', async () => {
    mockTransaction.mockRejectedValue(new Error('Something went wrong'));

    const response = await createRegularSimplePenaltyShootoutAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.penaltyShootout).toBe(null);
  });
});
