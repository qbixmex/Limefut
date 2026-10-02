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

import { createPlayoffAction } from '@/app/admin/liguilla/(actions)/create-playoff.action';

const tournamentPermalink = 'torneo-de-apertura-2026';
const categoryPermalink = 'varonil';
const tournamentId = '0a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d';
const categoryId = '1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d';
const playoffId = '376ec9ed-fd25-4d92-ad26-35b7a354eab1';
const teamIds = [
  '3a4b5c6d-7e8f-4a9b-8c1d-2e3f4a5b6c7d',
  '4b5c6d7e-8f9a-4b1c-9d2e-3f4a5b6c7d8e',
];

const validFormData = (): FormData => {
  const formData = new FormData();
  formData.append('tournament', tournamentPermalink);
  formData.append('category', categoryPermalink);
  formData.append('teamsIds', JSON.stringify(teamIds));
  formData.append('startingRound', 'quarterfinal');
  return formData;
};

const mockCreatedPlayoff = {
  id: playoffId,
  teamIds,
  tournamentId,
  categoryId,
};

const mockTx = {
  tournament: { findFirst: vi.fn() },
  category: { findFirst: vi.fn() },
  playoff: { create: vi.fn() },
};

describe('Tests on createPlayoffAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: 'b7e2ca32-af95-4750-bf63-6a338b236097', roles: ['admin'] },
    });
    mockTx.tournament.findFirst.mockResolvedValue({ id: tournamentId });
    mockTx.category.findFirst.mockResolvedValue({ id: categoryId });
    mockTx.playoff.create.mockResolvedValue(mockCreatedPlayoff);
    mockTransaction.mockImplementation((cb: (tx: typeof mockTx) => unknown) => cb(mockTx));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await createPlayoffAction({ formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(response.playoff).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: 'c45414c0-044b-4319-acbb-45584a0839fa',
        roles: ['user'],
      },
    });

    const response = await createPlayoffAction({ formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.playoff).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: '9fb64c9c-f5d9-4391-95e1-1a11f9edfeef',
        roles: null,
      },
    });

    const response = await createPlayoffAction({ formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.playoff).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when roles are empty', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: 'c8ad7f64-4d9f-4f17-b73d-964894b3bf29',
        roles: [],
      },
    });

    const response = await createPlayoffAction({ formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.playoff).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when less than two teams are selected', async () => {
    const formData = validFormData();
    formData.set('teamsIds', JSON.stringify([teamIds[0]]));

    const response = await createPlayoffAction({ formData });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/al menos 2 equipos/i);
    expect(response.playoff).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when starting round is missing', async () => {
    const formData = validFormData();
    formData.set('startingRound', '');

    const response = await createPlayoffAction({ formData });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/ronda inicial es obligatoria/i);
    expect(response.playoff).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when starting exceeds characters limit', async () => {
    const formData = validFormData();
    formData.set('startingRound', 'x'.repeat(101));

    const response = await createPlayoffAction({ formData });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/ronda inicial debe ser menor a 100 caracteres/i);
    expect(response.playoff).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when tournament does not exist', async () => {
    mockTx.tournament.findFirst.mockResolvedValue(null);

    const response = await createPlayoffAction({ formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toBe(`El torneo [${tournamentPermalink}] no existe`);
    expect(response.playoff).toBe(null);
    expect(mockTx.playoff.create).not.toHaveBeenCalled();
  });

  test('Should return error when category does not exist', async () => {
    mockTx.category.findFirst.mockResolvedValue(null);

    const response = await createPlayoffAction({ formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toBe(`La categoría con el enlace permanente [${categoryPermalink}] no existe`);
    expect(response.playoff).toBe(null);
    expect(mockTx.playoff.create).not.toHaveBeenCalled();
  });

  test('Should create a playoff successfully', async () => {
    const response = await createPlayoffAction({ formData: validFormData() });

    expect(response.ok).toBe(true);
    expect(response.message).toBe('Liguilla creada correctamente');
    expect(response.playoff).toEqual(mockCreatedPlayoff);
    expect(mockTx.tournament.findFirst).toHaveBeenCalledWith({
      where: { permalink: tournamentPermalink },
      select: { id: true },
    });
    expect(mockTx.category.findFirst).toHaveBeenCalledWith({
      where: { permalink: categoryPermalink },
      select: { id: true },
    });
    expect(mockTx.playoff.create).toHaveBeenCalledWith({
      data: {
        tournamentId,
        categoryId,
        teamIds,
        startingRound: 'quarterfinal',
      },
      select: {
        id: true,
        teamIds: true,
        tournamentId: true,
        categoryId: true,
      },
    });
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockTransaction.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: { modelName: 'Playoff' },
      }),
    );

    const response = await createPlayoffAction({ formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/campos duplicados/i);
    expect(response.playoff).toBe(null);
  });

  test('Should return generic prisma error for non-P2002 codes', async () => {
    mockTransaction.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
        meta: { modelName: 'Playoff' },
      }),
    );

    const response = await createPlayoffAction({ formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error al crear la liguilla/i);
    expect(response.playoff).toBe(null);
  });

  test('Should return error on unexpected Error instance', async () => {
    mockTransaction.mockRejectedValue(new Error('Something went wrong'));

    const response = await createPlayoffAction({ formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error al crear/i);
    expect(response.playoff).toBe(null);
  });

  test('Should return error on unknown error', async () => {
    mockTransaction.mockRejectedValue('Something unexpected');

    const response = await createPlayoffAction({ formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.playoff).toBe(null);
  });
});
