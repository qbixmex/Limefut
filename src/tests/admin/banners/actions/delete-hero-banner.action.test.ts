const { mockFindFirst, mockDelete, mockDeleteImage, mockGetSession } = vi.hoisted(() => ({
  mockFindFirst: vi.fn(),
  mockDelete: vi.fn(),
  mockDeleteImage: vi.fn(),
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
      findFirst: mockFindFirst,
      delete: mockDelete,
    },
  },
}));

vi.mock('@/shared/actions/deleteImageAction', () => ({
  default: mockDeleteImage,
}));

import { deleteHeroBannerAction } from '@/app/admin/banners/(actions)/delete-hero-banner.action';
import { heroBannerMock } from '../mocks/hero-banner.mock';

const bannerId = heroBannerMock.id;
const cloudinaryTestId = heroBannerMock.imagePublicId;

const mockBannerNoImage = {
  title: heroBannerMock.title,
  imagePublicId: null,
};

const mockBannerWithImage = {
  title: heroBannerMock.title,
  imagePublicId: cloudinaryTestId,
};

describe('Tests on deleteHeroBannerAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: {
        id: '1666de64-dbef-4672-8433-3d254b963bce',
        roles: ['admin'],
      },
    });
    mockFindFirst.mockResolvedValue(mockBannerNoImage);
    mockDelete.mockResolvedValue({ id: bannerId });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await deleteHeroBannerAction(bannerId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/debes estar autentificado/i);
    expect(mockFindFirst).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: '3261a4ef-2d4c-4d9f-9c43-20ef298702bd',
        roles: ['user'],
      },
    });

    const response = await deleteHeroBannerAction(bannerId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockFindFirst).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: '093afa23-81dd-401a-9ba5-933a89ca4500',
        roles: null,
      },
    });

    const response = await deleteHeroBannerAction(bannerId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockFindFirst).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is empty', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: 'f2cd2af0-677a-4b8a-a59c-5492a061edac',
        roles: [],
      },
    });

    const response = await deleteHeroBannerAction(bannerId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockFindFirst).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when banner does not exist', async () => {
    mockFindFirst.mockResolvedValue(null);

    const response = await deleteHeroBannerAction(bannerId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no se puede eliminar el banner/i);
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { id: bannerId },
      select: {
        title: true,
        imagePublicId: true,
      },
    });
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should delete a banner without image', async () => {
    const response = await deleteHeroBannerAction(bannerId);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/ha sido eliminado correctamente/i);
    expect(response.message).toContain(heroBannerMock.title);

    expect(mockDelete).toHaveBeenCalledWith({ where: { id: bannerId } });
    expect(mockDeleteImage).not.toHaveBeenCalled();
  });

  test('Should delete a banner with image and delete it from cloudinary', async () => {
    mockFindFirst.mockResolvedValue(mockBannerWithImage);
    mockDeleteImage.mockResolvedValue({ ok: true });

    const response = await deleteHeroBannerAction(bannerId);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/ha sido eliminado correctamente/i);
    expect(mockDeleteImage).toHaveBeenCalledWith(cloudinaryTestId);
  });

  test('Should throw when cloudinary image deletion fails', async () => {
    mockFindFirst.mockResolvedValue(mockBannerWithImage);
    mockDeleteImage.mockResolvedValue({ ok: false });

    await expect(deleteHeroBannerAction(bannerId)).rejects.toThrow('cloudinary');
    expect(mockDeleteImage).toHaveBeenCalledWith(cloudinaryTestId);
  });

  test('Should propagate error when findFirst fails', async () => {
    mockFindFirst.mockRejectedValue(new Error('DB connection failed'));

    await expect(deleteHeroBannerAction(bannerId)).rejects.toThrow('DB connection failed');
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should propagate error when delete fails', async () => {
    mockDelete.mockRejectedValue(new Error('Database connection lost'));

    await expect(deleteHeroBannerAction(bannerId)).rejects.toThrow('Database connection lost');
  });
});
