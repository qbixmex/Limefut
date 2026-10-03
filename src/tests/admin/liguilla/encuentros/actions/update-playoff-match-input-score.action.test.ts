const { mockUpdate, mockGetSession } = vi.hoisted(() => ({
  mockUpdate: vi.fn(),
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
    playoffMatch: { update: mockUpdate },
  },
}));

import { updatePlayoffMatchInputScoreAction } from '@/app/admin/liguilla/[playoff_id]/encuentros/(actions)/update-playoff-match-input-score.action';

const matchId = '6d7e8f9a-1b2c-4d3e-8f4a-5b6c7d8e9f0a';

describe('Tests on updatePlayoffMatchInputScoreAction server action', () => {
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

    const response = await updatePlayoffMatchInputScoreAction({
      matchId,
      score: 2,
      local: true,
      visitor: false,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should update the local score', async () => {
    const response = await updatePlayoffMatchInputScoreAction({
      matchId,
      score: 2,
      local: true,
      visitor: false,
    });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/marcador del partido fue actualizado/i);
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: matchId },
      data: { localScore: 2, visitorScore: undefined },
    });
  });

  test('Should update the visitor score', async () => {
    await updatePlayoffMatchInputScoreAction({
      matchId,
      score: 3,
      local: false,
      visitor: true,
    });

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: matchId },
      data: { localScore: undefined, visitorScore: 3 },
    });
  });
});
