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
    heroBanner: {
      count: mockCount,
      update: mockUpdate,
    },
  },
}));

import { updateHeroBannerStateAction } from '@/app/admin/banners/(actions)/update-hero-banner-state.action';
import { heroBannerMock } from '../mocks/hero-banner.mock';

const bannerId = heroBannerMock.id;

describe('Tests on updateHeroBannerStateAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: {
        id: 'f553ada5-c8f9-4e7a-810e-fe81bbb823ca',
        roles: ['admin'],
      },
    });
    mockCount.mockResolvedValue(1);
    mockUpdate.mockResolvedValue({
      title: heroBannerMock.title,
      active: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await updateHeroBannerStateAction(bannerId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/debes estar autentificado/i);
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: '2754ab77-c3b5-4e52-ae72-bc287d02592d',
        roles: ['user'],
      },
    });

    const response = await updateHeroBannerStateAction(bannerId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: '333469bc-9b81-4826-bd7e-bda6658f4c92',
        roles: null,
      },
    });

    const response = await updateHeroBannerStateAction(bannerId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is empty', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: '1c7ac704-cbca-4b28-b2f8-010b4229383c',
        roles: [],
      },
    });

    const response = await updateHeroBannerStateAction(bannerId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when banner does not exist', async () => {
    mockCount.mockResolvedValue(0);

    const response = await updateHeroBannerStateAction(bannerId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no se pudo actualizar el banner/i);
    expect(mockCount).toHaveBeenCalledWith({ where: { id: bannerId } });
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should activate a banner', async () => {
    const response = await updateHeroBannerStateAction(bannerId, true);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/activado/i);
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: bannerId },
      data: { active: true },
      select: { title: true, active: true },
    });
  });

  test('Should deactivate a banner', async () => {
    mockUpdate.mockResolvedValue({
      title: heroBannerMock.title,
      active: false,
    });

    const response = await updateHeroBannerStateAction(bannerId, false);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/desactivado/i);
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: bannerId },
      data: { active: false },
      select: { title: true, active: true },
    });
  });

  test('Should propagate error when count fails', async () => {
    mockCount.mockRejectedValue(new Error('DB connection failed'));

    await expect(updateHeroBannerStateAction(bannerId, true))
      .rejects
      .toThrow('DB connection failed');
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should propagate error when update fails', async () => {
    mockUpdate.mockRejectedValue(new Error('Database connection lost'));

    await expect(updateHeroBannerStateAction(bannerId, true))
      .rejects
      .toThrow('Database connection lost');
  });
});
