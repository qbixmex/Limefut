const {
  MockPrismaClientKnownRequestError,
  mockTournamentFindFirst,
  mockCategoryFindFirst,
  mockFieldFindFirst,
  mockMatchCreate,
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
    mockTournamentFindFirst: vi.fn(),
    mockCategoryFindFirst: vi.fn(),
    mockFieldFindFirst: vi.fn(),
    mockMatchCreate: vi.fn(),
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
    tournament: { findFirst: mockTournamentFindFirst },
    category: { findFirst: mockCategoryFindFirst },
    field: { findFirst: mockFieldFindFirst },
    match: { create: mockMatchCreate },
  },
}));

vi.mock('@/generated/prisma/client', () => ({
  Prisma: {
    PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
  },
}));

import { createMatchAction } from '@/app/admin/encuentros/(actions)/create-match.action';
import { MATCH_MODE } from '@/shared/enums';
import { AMERICA, CHIVAS } from '../mocks/teams.mock';
import { LIGA_MX } from '../mocks/tournaments.mock';
import { SUB_15 } from '../mocks/categories.mock';
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
  formData.append('status', 'scheduled');
  formData.append('mode', MATCH_MODE.LEAGUE);
  formData.append('tournament', LIGA_MX.permalink);
  formData.append('category', SUB_15.permalink);
  formData.append('week', '5');
  return formData;
};

const createdMatch = {
  id: matchId,
  localScore: 2,
  visitorScore: 1,
  status: 'scheduled',
  local: AMERICA,
  visitor: CHIVAS,
};

const mockTournament = { id: 'f641c5b8-0bcb-4b2c-ab90-27210ba17dac' };
const mockCategory = { id: '1ff58d74-2761-42f2-8250-2e009937921f' };

describe('Tests on createMatchAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => { });
    mockGetSession.mockResolvedValue({
      user: { id: 'b7e2ca32-af95-4750-bf63-6a338b236097', roles: ['admin'] },
    });
    mockTournamentFindFirst.mockResolvedValue(mockTournament);
    mockCategoryFindFirst.mockResolvedValue(mockCategory);
    mockFieldFindFirst.mockResolvedValue({ id: ESTADIO_AZTECA.id });
    mockMatchCreate.mockResolvedValue(createdMatch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await createMatchAction({ formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(response.match).toBe(null);
    expect(mockMatchCreate).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c45414c0-044b-4319-acbb-45584a0839fa', roles: ['user'] },
    });

    const response = await createMatchAction({ formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.match).toBe(null);
    expect(mockMatchCreate).not.toHaveBeenCalled();
  });

  test('Should return a validation error when the local team is missing', async () => {
    const formData = validFormData();
    formData.delete('localTeamId');

    const response = await createMatchAction({ formData });

    expect(response.ok).toBe(false);
    expect(response.match).toBe(null);
    expect(mockMatchCreate).not.toHaveBeenCalled();
  });

  test('Should return error when the tournament does not exist', async () => {
    mockTournamentFindFirst.mockResolvedValue(null);

    const response = await createMatchAction({ formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no existe/i);
    expect(response.match).toBe(null);
    expect(mockMatchCreate).not.toHaveBeenCalled();
  });

  test('Should return error when the category does not exist', async () => {
    mockCategoryFindFirst.mockResolvedValue(null);

    const response = await createMatchAction({ formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no existe/i);
    expect(response.match).toBe(null);
    expect(mockMatchCreate).not.toHaveBeenCalled();
  });

  test('Should return error when the field does not exist', async () => {
    mockFieldFindFirst.mockResolvedValue(null);

    const response = await createMatchAction({ formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no existe/i);
    expect(response.match).toBe(null);
    expect(mockMatchCreate).not.toHaveBeenCalled();
  });

  test('Should create the match and map the returned data', async () => {
    const response = await createMatchAction({ formData: validFormData() });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/encuentro creado correctamente/i);
    expect(response.match).toEqual(
      expect.objectContaining({
        id: matchId,
        localId: AMERICA.id,
        visitorId: CHIVAS.id,
        localScore: 2,
        visitorScore: 1,
      }),
    );
    expect(mockMatchCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          localId: AMERICA.id,
          visitorId: CHIVAS.id,
          fieldId: ESTADIO_AZTECA.id,
          tournamentId: mockTournament.id,
          categoryId: mockCategory.id,
          week: 5,
          mode: MATCH_MODE.LEAGUE,
        }),
      }),
    );
  });

  test('Should create a friendly match when the mode is friendly', async () => {
    const formData = validFormData();
    formData.set('mode', MATCH_MODE.FRIENDLY);

    await createMatchAction({ formData });

    expect(mockMatchCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ mode: MATCH_MODE.FRIENDLY }),
      }),
    );
  });

  test('Should return a validation error when the mode is missing', async () => {
    const formData = validFormData();
    formData.delete('mode');

    const response = await createMatchAction({ formData });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/tipo de encuentro/i);
    expect(mockMatchCreate).not.toHaveBeenCalled();
  });

  test('Should return a validation error when the mode is invalid', async () => {
    const formData = validFormData();
    formData.set('mode', 'lorem');

    const response = await createMatchAction({ formData });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/tipo de encuentro/i);
    expect(mockMatchCreate).not.toHaveBeenCalled();
  });

  test('Should set week to null when week is not provided', async () => {
    const formData = validFormData();
    formData.delete('week');

    await createMatchAction({ formData });

    expect(mockMatchCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ week: null }),
      }),
    );
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockMatchCreate.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: {
          modelName: 'Match',
          target: ['localId'],
        },
      }),
    );

    const response = await createMatchAction({ formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error de campos duplicados/i);
    expect(response.match).toBe(null);
  });

  test('Should return a generic prisma error for non-P2002 codes', async () => {
    mockMatchCreate.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
        meta: { modelName: 'Match' },
      }),
    );

    const response = await createMatchAction({ formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error al crear el encuentro/i);
    expect(response.match).toBe(null);
  });

  test('Should return an error on unexpected Error instance', async () => {
    mockMatchCreate.mockRejectedValue(new Error('Something went wrong'));

    const response = await createMatchAction({ formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.match).toBe(null);
  });

  test('Should return an error on unknown error', async () => {
    mockMatchCreate.mockRejectedValue('Something unexpected');

    const response = await createMatchAction({ formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.match).toBe(null);
  });
});
