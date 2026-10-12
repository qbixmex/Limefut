const {
  mockMatchFindUnique,
  mockMatchUpdate,
  mockStandingsFindFirst,
  mockStandingsUpdate,
  mockGetSession,
} = vi.hoisted(() => ({
  mockMatchFindUnique: vi.fn(),
  mockMatchUpdate: vi.fn(),
  mockStandingsFindFirst: vi.fn(),
  mockStandingsUpdate: vi.fn(),
  mockGetSession: vi.fn(),
}));

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
      findUnique: mockMatchFindUnique,
      update: mockMatchUpdate,
    },
    standings: {
      findFirst: mockStandingsFindFirst,
      update: mockStandingsUpdate,
    },
  },
}));

import { updateMatchScoreAction } from '@/app/admin/encuentros/(actions)/update-match-score.action';

const matchId = '0251b9bf-55e5-48fb-ae2c-6fcdad308d13';
const localId = '3f24c2e0-7fd2-46e4-94ba-4dd0b557e675';
const visitorId = '99182b8e-143a-479b-8496-24f283e847ae';

const baseProps = {
  matchId,
  localScore: 2,
  visitorScore: 1,
  localId,
  visitorId,
};

describe('Tests on updateMatchScoreAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => { });
    vi.spyOn(console, 'error').mockImplementation(() => { });
    mockGetSession.mockResolvedValue({
      user: { id: 'b7e2ca32-af95-4750-bf63-6a338b236097', roles: ['admin'] },
    });
    mockMatchFindUnique.mockResolvedValue({
      localScore: 0,
      visitorScore: 0,
      tournamentId: 'f641c5b8-0bcb-4b2c-ab90-27210ba17dac',
      categoryId: '1ff58d74-2761-42f2-8250-2e009937921f',
      tournament: { permalink: 'liga-mx' },
      category: { id: 'c1', name: 'Sub-15', permalink: 'sub-15' },
    });
    mockStandingsFindFirst.mockResolvedValue({ id: 'standings-id' });
    mockStandingsUpdate.mockResolvedValue({ id: 'standings-id' });
    mockMatchUpdate.mockResolvedValue({
      tournament: { id: 'f641c5b8-0bcb-4b2c-ab90-27210ba17dac', permalink: 'liga-mx' },
      category: { id: 'c1', name: 'Sub-15', permalink: 'sub-15' },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await updateMatchScoreAction(baseProps);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(mockMatchUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when the match does not exist', async () => {
    mockMatchFindUnique.mockResolvedValue(null);

    const response = await updateMatchScoreAction(baseProps);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/partido no encontrado/i);
    expect(mockMatchUpdate).not.toHaveBeenCalled();
  });

  test('Should revert and reapply standings and update the match', async () => {
    const response = await updateMatchScoreAction(baseProps);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/marcador del partido se actualizó correctamente/i);
    expect(mockStandingsUpdate).toHaveBeenCalledTimes(4);
    expect(mockMatchUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: matchId },
        data: { localScore: 2, visitorScore: 1, status: 'completed' },
      }),
    );
  });

  test('Should return error when the local standings record is missing', async () => {
    mockStandingsFindFirst.mockResolvedValue(null);

    const response = await updateMatchScoreAction(baseProps);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/equipo local/i);
    expect(mockMatchUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when the match could not be updated', async () => {
    mockMatchUpdate.mockResolvedValue(null);

    const response = await updateMatchScoreAction(baseProps);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no se pudo actualizar/i);
  });

  test('Should return an error on unexpected failures', async () => {
    mockMatchFindUnique.mockRejectedValue(new Error('DB exploded'));

    const response = await updateMatchScoreAction(baseProps);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.currentMatch).toBe(null);
  });
});
