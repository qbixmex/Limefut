const {
  MockPrismaClientKnownRequestError,
  mockMatchFindFirst,
  mockShootoutFindFirst,
  mockShootoutCreate,
  mockShootoutUpdate,
  mockStandingsUpsert,
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
    mockMatchFindFirst: vi.fn(),
    mockShootoutFindFirst: vi.fn(),
    mockShootoutCreate: vi.fn(),
    mockShootoutUpdate: vi.fn(),
    mockStandingsUpsert: vi.fn(),
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
    match: { findFirst: mockMatchFindFirst },
    penaltyShootout: {
      findFirst: mockShootoutFindFirst,
      create: mockShootoutCreate,
      update: mockShootoutUpdate,
    },
    standings: { upsert: mockStandingsUpsert },
  },
}));

vi.mock('@/generated/prisma/client', () => ({
  Prisma: {
    PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
  },
}));

import { createRegularPenaltyShootoutAction } from '@/app/admin/encuentros/(actions)/create-regular-penalty-shootouts.action';
import { AMERICA, CHIVAS } from '../mocks/teams.mock';

const matchId = '0251b9bf-55e5-48fb-ae2c-6fcdad308d13';
const shootoutId = 'b2f343d3-5936-4e83-9bcf-6ffa150d9dc3';
const localPlayerId = '49b70abe-9944-4a33-94a9-b12cb0003719';
const visitorPlayerId = '6944f902-618a-498b-880d-86f70ad534c2';

const validFormData = (): FormData => {
  const formData = new FormData();
  formData.append('matchId', matchId);
  formData.append('localTeamId', AMERICA.id);
  formData.append('visitorTeamId', CHIVAS.id);
  formData.append('localPlayerId', localPlayerId);
  formData.append('localPlayerName', 'Luis García');
  formData.append('visitorPlayerId', visitorPlayerId);
  formData.append('visitorPlayerName', 'Carlos Ruiz');
  formData.append('localIsGoal', 'scored');
  formData.append('visitorIsGoal', 'missed');
  return formData;
};

const emptyShootout = {
  id: shootoutId,
  matchId,
  localTeamId: AMERICA.id,
  visitorTeamId: CHIVAS.id,
  localGoals: 0,
  visitorGoals: 0,
  winnerTeamId: null,
  status: 'in_progress',
  kicks: [],
};

const completedShootout = {
  ...emptyShootout,
  localGoals: 3,
  visitorGoals: 1,
  winnerTeamId: AMERICA.id,
  status: 'completed',
};

describe('Tests on createRegularPenaltyShootoutAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => { });
    mockGetSession.mockResolvedValue({
      user: { id: 'b7e2ca32-af95-4750-bf63-6a338b236097', roles: ['admin'] },
    });
    mockMatchFindFirst.mockResolvedValue({
      id: matchId,
      tournamentId: 'f641c5b8-0bcb-4b2c-ab90-27210ba17dac',
      categoryId: '1ff58d74-2761-42f2-8250-2e009937921f',
      mode: 'league',
    });
    mockShootoutFindFirst.mockResolvedValue(null);
    mockShootoutCreate.mockResolvedValue(emptyShootout);
    mockShootoutUpdate.mockResolvedValue(emptyShootout);
    mockStandingsUpsert.mockResolvedValue({ id: 'standings-id' });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await createRegularPenaltyShootoutAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(mockMatchFindFirst).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c45414c0-044b-4319-acbb-45584a0839fa', roles: ['user'] },
    });

    const response = await createRegularPenaltyShootoutAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockMatchFindFirst).not.toHaveBeenCalled();
  });

  test('Should return a validation error when the local shooter is missing', async () => {
    const formData = validFormData();
    formData.delete('localPlayerId');

    const response = await createRegularPenaltyShootoutAction(formData);

    expect(response.ok).toBe(false);
    expect(response.penaltyShootout).toBe(null);
    expect(mockMatchFindFirst).not.toHaveBeenCalled();
  });

  test('Should return error when the match does not exist', async () => {
    mockMatchFindFirst.mockResolvedValue(null);

    const response = await createRegularPenaltyShootoutAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no existe/i);
    expect(mockShootoutUpdate).not.toHaveBeenCalled();
  });

  test('Should create a shootout and add the first kicks', async () => {
    const response = await createRegularPenaltyShootoutAction(validFormData());

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/tanda de penales creada correctamente/i);
    expect(mockShootoutCreate).toHaveBeenCalledWith({
      data: {
        matchId,
        localTeamId: AMERICA.id,
        visitorTeamId: CHIVAS.id,
      },
      include: { kicks: true },
    });
    expect(mockShootoutUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: shootoutId },
        data: expect.objectContaining({
          kicks: {
            create: expect.arrayContaining([
              expect.objectContaining({ teamId: AMERICA.id, isGoal: true, order: 1 }),
              expect.objectContaining({ teamId: CHIVAS.id, isGoal: false, order: 2 }),
            ]),
          },
        }),
      }),
    );
  });

  test('Should complete the shootout and award a standings point to the winner', async () => {
    mockShootoutFindFirst.mockResolvedValue({
      ...emptyShootout,
      localGoals: 2,
      visitorGoals: 1,
      kicks: [
        { teamId: AMERICA.id, order: 2 },
        { teamId: CHIVAS.id, order: 2 },
        { teamId: AMERICA.id, order: 1 },
        { teamId: CHIVAS.id, order: 1 },
      ],
    });
    mockShootoutUpdate.mockResolvedValue(completedShootout);

    const response = await createRegularPenaltyShootoutAction(validFormData());

    expect(response.ok).toBe(true);
    expect(mockStandingsUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({ totalPoints: { increment: 1 } }),
      }),
    );
  });

  test('Should not award standings points when the match is friendly', async () => {
    mockMatchFindFirst.mockResolvedValue({
      id: matchId,
      tournamentId: 'f641c5b8-0bcb-4b2c-ab90-27210ba17dac',
      categoryId: '1ff58d74-2761-42f2-8250-2e009937921f',
      mode: 'friendly',
    });
    mockShootoutFindFirst.mockResolvedValue({
      ...emptyShootout,
      localGoals: 2,
      visitorGoals: 1,
      kicks: [
        { teamId: AMERICA.id, order: 2 },
        { teamId: CHIVAS.id, order: 2 },
        { teamId: AMERICA.id, order: 1 },
        { teamId: CHIVAS.id, order: 1 },
      ],
    });
    mockShootoutUpdate.mockResolvedValue(completedShootout);

    const response = await createRegularPenaltyShootoutAction(validFormData());

    expect(response.ok).toBe(true);
    expect(mockStandingsUpsert).not.toHaveBeenCalled();
  });

  test('Should return a "not found" error on missing records (P2001)', async () => {
    mockShootoutUpdate.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Record not found', {
        code: 'P2001',
        meta: { modelName: 'PenaltyShootout', target: ['matchId'] },
      }),
    );

    const response = await createRegularPenaltyShootoutAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/la tanda de penales no existe/i);
    expect(response.penaltyShootout).toBe(null);
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockShootoutUpdate.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: { modelName: 'PenaltyShootout', target: ['matchId'] },
      }),
    );

    const response = await createRegularPenaltyShootoutAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/hay campos duplicados/i);
    expect(response.message).not.toMatch(/matchId/i);
    expect(response.penaltyShootout).toBe(null);
  });

  test('Should return a generic error for prisma errors', async () => {
    mockShootoutUpdate.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
        meta: { modelName: 'PenaltyShootout' },
      }),
    );

    const response = await createRegularPenaltyShootoutAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error al crear la tanda de penales/i);
    expect(response.penaltyShootout).toBe(null);
  });

  test('Should return an error on unexpected Error instance', async () => {
    mockShootoutUpdate.mockRejectedValue(new Error('Something went wrong'));

    const response = await createRegularPenaltyShootoutAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.penaltyShootout).toBe(null);
  });
});
