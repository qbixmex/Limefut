const {
  mockImagesCount,
  mockFindUnique,
  mockDelete,
  mockGetSession,
} = vi.hoisted(() => ({
  mockImagesCount: vi.fn(),
  mockFindUnique: vi.fn(),
  mockDelete: vi.fn(),
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
      count: mockImagesCount,
    },
    gallery: {
      findUnique: mockFindUnique,
      delete: mockDelete,
    },
  },
}));

import { deleteGalleryAction } from '@/app/admin/galerias/(actions)/deleteGalleryAction';
import { updateTag } from 'next/cache';

const galleryId = '1f0e2d3c-4b5a-4968-8776-655443322110';

describe('Tests on deleteGalleryAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockResolvedValue({
      user: { id: 'b7e2ca32-af95-4750-bf63-6a338b236097', roles: ['admin'] },
    });
    mockImagesCount.mockResolvedValue(0);
    mockFindUnique.mockResolvedValue({
      id: galleryId,
      title: 'Galería de Apertura',
    });
    mockDelete.mockResolvedValue({ title: 'Galería de Apertura' });
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await deleteGalleryAction(galleryId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(mockImagesCount).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c45414c0-044b-4319-acbb-45584a0839fa', roles: ['user'] },
    });

    const response = await deleteGalleryAction(galleryId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: '9fb64c9c-f5d9-4391-95e1-1a11f9edfeef', roles: null },
    });

    const response = await deleteGalleryAction(galleryId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when roles are empty', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c8ad7f64-4d9f-4f17-b73d-964894b3bf29', roles: [] },
    });

    const response = await deleteGalleryAction(galleryId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when gallery still contains images', async () => {
    mockImagesCount.mockResolvedValue(2);

    const response = await deleteGalleryAction(galleryId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No se puede eliminar la galería por que contiene imágenes');
    expect(mockImagesCount).toHaveBeenCalledWith({ where: { galleryId } });
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when gallery does not exist', async () => {
    mockFindUnique.mockResolvedValue(null);

    const response = await deleteGalleryAction(galleryId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No se puede eliminar la galería, quizás fue eliminada ó no existe');
    expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: galleryId } });
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should delete a gallery successfully', async () => {
    const response = await deleteGalleryAction(galleryId);

    expect(response.ok).toBe(true);
    expect(response.message).toBe('La galería "Galería de Apertura" ha sido eliminada correctamente');
    expect(mockDelete).toHaveBeenCalledWith({
      where: { id: galleryId },
      select: { title: true },
    });
    expect(updateTag).toHaveBeenCalledWith('admin-galleries');
    expect(updateTag).toHaveBeenCalledWith('public-gallery');
  });

  test('Should propagate errors because the action has no try/catch', async () => {
    mockImagesCount.mockRejectedValue(new Error('DB connection failed'));

    await expect(deleteGalleryAction(galleryId)).rejects.toThrow('DB connection failed');
  });

  test('Should propagate errors thrown by the delete query', async () => {
    mockDelete.mockRejectedValue(new Error('Delete failed'));

    await expect(deleteGalleryAction(galleryId)).rejects.toThrow('Delete failed');
  });
});
