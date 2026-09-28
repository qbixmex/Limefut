const { mockCount, mockUpdate, mockGetSession } = vi.hoisted(() => ({
  mockCount: vi.fn(),
  mockUpdate: vi.fn(),
  mockGetSession: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('@/lib/get-session', () => ({
  getSession: mockGetSession,
  requireAdmin: async () => {
    const session = await mockGetSession();

    if (!session?.user) {
      return {
        ok: false,
        message: '¡ Debes estar autentificado para realizar esta acción !',
      };
    }

    if (!session.user.roles?.includes('admin')) {
      return {
        ok: false,
        message: '¡ No tienes permisos administrativos para realizar esta acción !',
      };
    }

    return { ok: true, session };
  },
}));

vi.mock('@/lib/prisma', () => ({
  default: {
    coach: {
      count: mockCount,
      update: mockUpdate,
    },
  },
}));

import { updateCoachStateAction } from '@/app/admin/entrenadores/(actions)/update-coach-state.action';

const coachId = 'c93a8c24-ca76-493c-b1e3-f533454bbdae';

describe('Tests on updateCoachStateAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['admin'] },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await updateCoachStateAction(coachId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/debes estar autentificado/i);
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: '5acd4927-6f46-4f30-91a8-7bdea8c8c707',
        roles: ['user'],
      },
    });

    const response = await updateCoachStateAction(coachId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: '138edcaa-a854-4edf-bd17-eb6724b9228d',
        roles: null,
      },
    });

    const response = await updateCoachStateAction(coachId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is empty', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: '9960f80f-d76e-40c7-a44a-673ac32e923c',
        roles: [],
      },
    });

    const response = await updateCoachStateAction(coachId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when coach does not exist', async () => {
    mockCount.mockResolvedValue(0);

    const response = await updateCoachStateAction(coachId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no existe/i);
    expect(mockCount).toHaveBeenCalledWith({
      where: { id: coachId },
    });
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should activate a coach', async () => {
    mockCount.mockResolvedValue(1);
    mockUpdate.mockResolvedValue({
      name: 'Roberto Sánchez',
      active: true,
    });

    const response = await updateCoachStateAction(coachId, true);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/activado/i);
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: coachId },
      data: { active: true },
      select: { name: true, active: true },
    });
  });

  test('Should deactivate a coach', async () => {
    mockCount.mockResolvedValue(1);
    mockUpdate.mockResolvedValue({
      name: 'Roberto Sánchez',
      active: false,
    });

    const response = await updateCoachStateAction(coachId, false);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/desactivado/i);
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: coachId },
      data: { active: false },
      select: { name: true, active: true },
    });
  });

  test('Should propagate error when count fails', async () => {
    mockCount.mockRejectedValue(new Error('DB connection failed'));

    const actionPromise = updateCoachStateAction(coachId, true);

    await expect(actionPromise)
      .rejects
      .toThrow('DB connection failed');
    expect(mockUpdate).not.toHaveBeenCalled();
  });
});
