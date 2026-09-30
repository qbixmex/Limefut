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

import { updateHeroBannerAlignmentAction } from '@/app/admin/banners/(actions)/update-hero-banner-alignment.action';
import { heroBannerMock } from '../mocks/hero-banner.mock';

const bannerId = heroBannerMock.id;

describe('Tests on updateHeroBannerAlignmentAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: {
        id: '3ab789f9-cd88-4d4f-8097-d634f008b8b6',
        roles: ['admin'],
      },
    });
    mockCount.mockResolvedValue(1);
    mockUpdate.mockResolvedValue({ id: bannerId });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await updateHeroBannerAlignmentAction(bannerId, 'center');

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/debes estar autentificado/i);
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: 'a642f4c9-470b-4134-b674-38b21a8ac77b',
        roles: ['user'],
      },
    });

    const response = await updateHeroBannerAlignmentAction(bannerId, 'center');

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: '476793ea-614c-43d1-8372-0d56bb10856f',
        roles: null,
      },
    });

    const response = await updateHeroBannerAlignmentAction(bannerId, 'center');

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is empty', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: '7dba2a2d-fe42-4c52-8a3b-185cbd318e49',
        roles: [],
      },
    });

    const response = await updateHeroBannerAlignmentAction(bannerId, 'center');

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when banner does not exist', async () => {
    mockCount.mockResolvedValue(0);

    const response = await updateHeroBannerAlignmentAction(bannerId, 'center');

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no se pudo actualizar el banner/i);
    expect(mockCount).toHaveBeenCalledWith({ where: { id: bannerId } });
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should update the banner alignment', async () => {
    const response = await updateHeroBannerAlignmentAction(bannerId, 'center');

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/alineación correctamente/i);
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: bannerId },
      data: { dataAlignment: 'center' },
      select: { id: true },
    });
  });

  test('Should propagate error when count fails', async () => {
    mockCount.mockRejectedValue(new Error('DB connection failed'));

    await expect(updateHeroBannerAlignmentAction(bannerId, 'center'))
      .rejects
      .toThrow('DB connection failed');
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should propagate error when update fails', async () => {
    mockUpdate.mockRejectedValue(new Error('Database connection lost'));

    await expect(updateHeroBannerAlignmentAction(bannerId, 'center'))
      .rejects
      .toThrow('Database connection lost');
  });
});
