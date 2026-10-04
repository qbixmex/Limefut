const {
  mockCount,
  mockDelete,
  mockUpdateMany,
  mockDeleteImage,
  mockGetSession,
} = vi.hoisted(() => ({
  mockCount: vi.fn(),
  mockDelete: vi.fn(),
  mockUpdateMany: vi.fn(),
  mockDeleteImage: vi.fn(),
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
    galleryImage: {
      count: mockCount,
      delete: mockDelete,
      updateMany: mockUpdateMany,
    },
  },
}));

vi.mock('~/src/shared/actions', () => ({
  deleteImage: mockDeleteImage,
}));

import { deleteGalleryImageAction } from '@/app/admin/galerias/(actions)/gallery-images/delete-gallery-image.action';
import { updateTag } from 'next/cache';

const galleryImageId = '1f0e2d3c-4b5a-4968-8776-655443322110';

describe('Tests on deleteGalleryImageAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: 'b7e2ca32-af95-4750-bf63-6a338b236097', roles: ['admin'] },
    });
    mockCount.mockResolvedValue(1);
    mockDelete.mockResolvedValue({
      imagePublicID: 'cloudinary-public-id',
      position: 2,
      gallery: { permalink: 'galeria-test' },
    });
    mockUpdateMany.mockResolvedValue({ count: 3 });
    mockDeleteImage.mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await deleteGalleryImageAction(galleryImageId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c45414c0-044b-4319-acbb-45584a0839fa', roles: ['user'] },
    });

    const response = await deleteGalleryImageAction(galleryImageId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: '9fb64c9c-f5d9-4391-95e1-1a11f9edfeef', roles: null },
    });

    const response = await deleteGalleryImageAction(galleryImageId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when roles are empty', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c8ad7f64-4d9f-4f17-b73d-964894b3bf29', roles: [] },
    });

    const response = await deleteGalleryImageAction(galleryImageId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when gallery image does not exist', async () => {
    mockCount.mockResolvedValue(0);

    const response = await deleteGalleryImageAction(galleryImageId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no se puede eliminar la imagen de la galería/i);
    expect(mockCount).toHaveBeenCalledWith({ where: { id: galleryImageId } });
    expect(mockDelete).not.toHaveBeenCalled();
    expect(mockDeleteImage).not.toHaveBeenCalled();
    expect(mockUpdateMany).not.toHaveBeenCalled();
  });

  test('Should delete a gallery image and its cloudinary image successfully', async () => {
    const response = await deleteGalleryImageAction(galleryImageId);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/imagen de la galería ha sido eliminada/i);
    expect(mockDelete).toHaveBeenCalledWith({
      where: { id: galleryImageId },
      select: {
        imagePublicID: true,
        position: true,
        gallery: { select: { permalink: true } },
      },
    });
    expect(mockDeleteImage).toHaveBeenCalledWith('cloudinary-public-id');
    expect(mockUpdateMany).toHaveBeenCalledWith({
      where: { position: { gt: 2 } },
      data: { position: { decrement: 1 } },
    });
    expect(updateTag).toHaveBeenCalledWith('admin-galleries');
    expect(updateTag).toHaveBeenCalledWith('admin-gallery');
    expect(updateTag).toHaveBeenCalledWith('dashboard-images');
    expect(updateTag).toHaveBeenCalledWith('public-home-images');
  });

  test('Should skip cloudinary deletion when image has no public id', async () => {
    mockDelete.mockResolvedValue({
      imagePublicID: null,
      position: 1,
      gallery: { permalink: 'galeria-test' },
    });

    const response = await deleteGalleryImageAction(galleryImageId);

    expect(response.ok).toBe(true);
    expect(mockDeleteImage).not.toHaveBeenCalled();
    expect(mockUpdateMany).toHaveBeenCalledWith({
      where: { position: { gt: 1 } },
      data: { position: { decrement: 1 } },
    });
  });

  test('Should throw when cloudinary image deletion fails', async () => {
    mockDeleteImage.mockResolvedValue({ ok: false });

    await expect(deleteGalleryImageAction(galleryImageId)).rejects.toThrow(
      'Error al eliminar la imagen de cloudinary',
    );
    expect(mockUpdateMany).not.toHaveBeenCalled();
  });

  test('Should propagate errors thrown by the count query', async () => {
    mockCount.mockRejectedValue(new Error('DB connection failed'));

    await expect(deleteGalleryImageAction(galleryImageId)).rejects.toThrow(
      'DB connection failed',
    );
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should propagate errors thrown by the delete query', async () => {
    mockDelete.mockRejectedValue(new Error('Delete failed'));

    await expect(deleteGalleryImageAction(galleryImageId)).rejects.toThrow('Delete failed');
    expect(mockUpdateMany).not.toHaveBeenCalled();
  });

  test('Should propagate errors thrown while shifting positions', async () => {
    mockUpdateMany.mockRejectedValue(new Error('UpdateMany failed'));

    await expect(deleteGalleryImageAction(galleryImageId)).rejects.toThrow('UpdateMany failed');
    expect(mockDeleteImage).toHaveBeenCalledWith('cloudinary-public-id');
  });
});
