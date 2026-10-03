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

import { finishPlayoffMatchAction } from '@/app/admin/liguilla/[playoff_id]/encuentros/(actions)/finish-playoff-match.action';
import { MATCH_STATUS } from '@/shared/enums';

const matchId = '6d7e8f9a-1b2c-4d3e-8f4a-5b6c7d8e9f0a';
const localId = '3a4b5c6d-7e8f-4a9b-8c1d-2e3f4a5b6c7d';
const visitorId = '4b5c6d7e-8f9a-4b1c-9d2e-3f4a5b6c7d8e';

describe('Tests on finishPlayoffMatchAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => { });
    mockGetSession.mockResolvedValue({
      user: {
        id: 'b7e2ca32-af95-4750-bf63-6a338b236097',
        roles: ['admin'],
      },
    });
    mockUpdate.mockResolvedValue({ id: matchId });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await finishPlayoffMatchAction({
      matchId,
      localScore: 1,
      visitorScore: 0,
      localId,
      visitorId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should set the local team as winner', async () => {
    const response = await finishPlayoffMatchAction({
      matchId,
      localScore: 2,
      visitorScore: 1,
      localId,
      visitorId,
    });

    expect(response.ok).toBe(true);
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: matchId },
      data: {
        localScore: 2,
        visitorScore: 1,
        winnerId: localId,
        status: MATCH_STATUS.COMPLETED,
      },
    });
  });

  test('Should set the visitor team as winner', async () => {
    await finishPlayoffMatchAction({
      matchId,
      localScore: 1,
      visitorScore: 3,
      localId,
      visitorId,
    });

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ winnerId: visitorId }),
      }),
    );
  });

  test('Should set a null winner on a draw', async () => {
    await finishPlayoffMatchAction({
      matchId,
      localScore: 2,
      visitorScore: 2,
      localId,
      visitorId,
    });

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ winnerId: null }),
      }),
    );
  });
});
