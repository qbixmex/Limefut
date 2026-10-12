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

import { finishMatchAction } from '@/app/admin/encuentros/(actions)/finish-match.action';
import { MATCH_STATUS } from '@/shared/enums';

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

describe('Tests on finishMatchAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => { });
    vi.spyOn(console, 'error').mockImplementation(() => { });
    mockGetSession.mockResolvedValue({
      user: { id: 'b7e2ca32-af95-4750-bf63-6a338b236097', roles: ['admin'] },
    });
    mockMatchFindUnique.mockResolvedValue({
      tournamentId: 'f641c5b8-0bcb-4b2c-ab90-27210ba17dac',
      categoryId: '1ff58d74-2761-42f2-8250-2e009937921f',
    });
    mockStandingsFindFirst.mockResolvedValue({ id: 'standings-id' });
    mockStandingsUpdate.mockResolvedValue({ id: 'standings-id' });
    mockMatchUpdate.mockResolvedValue({ id: matchId });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await finishMatchAction(baseProps);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(mockMatchUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c45414c0-044b-4319-acbb-45584a0839fa', roles: ['user'] },
    });

    const response = await finishMatchAction(baseProps);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockMatchUpdate).not.toHaveBeenCalled();
  });

  test('Should finish the match and mark it as completed', async () => {
    const response = await finishMatchAction(baseProps);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/finalizó correctamente/i);
    expect(mockMatchUpdate).toHaveBeenCalledWith({
      where: { id: matchId },
      data: {
        localScore: 2,
        visitorScore: 1,
        status: MATCH_STATUS.COMPLETED,
      },
    });
  });

  test('Should award three points to the local team when it wins', async () => {
    await finishMatchAction(baseProps);

    expect(mockStandingsUpdate).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: { id: 'standings-id' },
        data: expect.objectContaining({
          wins: { increment: 1 },
          losses: { increment: 0 },
        }),
      }),
    );
    expect(mockStandingsUpdate).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        data: expect.objectContaining({
          wins: { increment: 0 },
          losses: { increment: 1 },
        }),
      }),
    );
  });

  test('Should award one point to each team on a draw', async () => {
    await finishMatchAction({ ...baseProps, localScore: 1, visitorScore: 1 });

    expect(mockStandingsUpdate).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        data: expect.objectContaining({
          draws: { increment: 1 },
          points: { increment: 1 },
        }),
      }),
    );
    expect(mockStandingsUpdate).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        data: expect.objectContaining({
          draws: { increment: 1 },
          points: { increment: 1 },
        }),
      }),
    );
  });

  test('Should award three points to the visitor team when it wins', async () => {
    await finishMatchAction({ ...baseProps, localScore: 0, visitorScore: 2 });

    expect(mockStandingsUpdate).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        data: expect.objectContaining({ wins: { increment: 1 } }),
      }),
    );
  });

  test('Should skip standings when the match is not found', async () => {
    mockMatchFindUnique.mockResolvedValue(null);

    const response = await finishMatchAction(baseProps);

    expect(mockStandingsFindFirst).not.toHaveBeenCalled();
    expect(response.ok).toBe(true);
  });

  test('Should keep going when updating standings throws', async () => {
    mockStandingsFindFirst.mockRejectedValue(new Error('standings error'));

    const response = await finishMatchAction(baseProps);

    expect(response.ok).toBe(true);
    expect(mockMatchUpdate).toHaveBeenCalled();
  });

  test('Should return error when the match could not be finished', async () => {
    mockMatchUpdate.mockResolvedValue(null);

    const response = await finishMatchAction(baseProps);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no se pudo finalizar/i);
  });
});
