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
    heroBanner: {
      count: mockCount,
      update: mockUpdate,
    },
  },
}));

import { updateHeroBannerShowDataAction } from '@/app/admin/banners/(actions)/update-hero-banner-show-data.action';
import { heroBannerMock } from '../mocks/hero-banner.mock';

const bannerId = heroBannerMock.id;

describe('Tests on updateHeroBannerShowDataAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: {
        id: 'bfae9fa1-cc16-470e-a03d-3132cd3888a8',
        roles: ['admin'],
      },
    });
    mockCount.mockResolvedValue(1);
    mockUpdate.mockResolvedValue({
      title: heroBannerMock.title,
      showData: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await updateHeroBannerShowDataAction(bannerId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/debes estar autentificado/i);
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: '04ba4832-7a2f-4138-8c7c-017aa87458b5',
        roles: ['user'],
      },
    });

    const response = await updateHeroBannerShowDataAction(bannerId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: '8ecd9159-3280-4cc9-81f7-9292bb97889e',
        roles: null,
      },
    });

    const response = await updateHeroBannerShowDataAction(bannerId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is empty', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: 'f98ec434-c190-45bb-9b9c-8025da1f5501',
        roles: [],
      },
    });

    const response = await updateHeroBannerShowDataAction(bannerId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when banner does not exist', async () => {
    mockCount.mockResolvedValue(0);

    const response = await updateHeroBannerShowDataAction(bannerId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no se pudo actualizar el banner/i);
    expect(mockCount).toHaveBeenCalledWith({ where: { id: bannerId } });
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should show banner data', async () => {
    const response = await updateHeroBannerShowDataAction(bannerId, true);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/mostrado/i);
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: bannerId },
      data: { showData: true },
      select: { title: true, showData: true },
    });
  });

  test('Should hide banner data', async () => {
    mockUpdate.mockResolvedValue({
      title: heroBannerMock.title,
      showData: false,
    });

    const response = await updateHeroBannerShowDataAction(bannerId, false);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/ocultado/i);
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: bannerId },
      data: { showData: false },
      select: { title: true, showData: true },
    });
  });

  test('Should propagate error when count fails', async () => {
    mockCount.mockRejectedValue(new Error('DB connection failed'));

    await expect(updateHeroBannerShowDataAction(bannerId, true))
      .rejects
      .toThrow('DB connection failed');
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should propagate error when update fails', async () => {
    mockUpdate.mockRejectedValue(new Error('Database connection lost'));

    await expect(updateHeroBannerShowDataAction(bannerId, true))
      .rejects
      .toThrow('Database connection lost');
  });
});
