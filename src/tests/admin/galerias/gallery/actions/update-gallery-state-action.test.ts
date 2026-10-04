const { mockCount, mockUpdate, mockGetSession } = vi.hoisted(() => ({
  mockCount: vi.fn(),
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
    gallery: {
      count: mockCount,
      update: mockUpdate,
    },
  },
}));

import { updateGalleryStateAction } from '@/app/admin/galerias/(actions)/gallery/update-gallery-state.action';
import { updateTag } from 'next/cache';

const galleryId = '1f0e2d3c-4b5a-4968-8776-655443322110';

describe('Tests on updateGalleryStateAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSession.mockResolvedValue({
      user: { id: 'b7e2ca32-af95-4750-bf63-6a338b236097', roles: ['admin'] },
    });
    mockCount.mockResolvedValue(1);
    mockUpdate.mockResolvedValue({ title: 'Galería de Apertura', active: true });
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await updateGalleryStateAction(galleryId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c45414c0-044b-4319-acbb-45584a0839fa', roles: ['user'] },
    });

    const response = await updateGalleryStateAction(galleryId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: '9fb64c9c-f5d9-4391-95e1-1a11f9edfeef', roles: null },
    });

    const response = await updateGalleryStateAction(galleryId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when roles are empty', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c8ad7f64-4d9f-4f17-b73d-964894b3bf29', roles: [] },
    });

    const response = await updateGalleryStateAction(galleryId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when gallery does not exist', async () => {
    mockCount.mockResolvedValue(0);

    const response = await updateGalleryStateAction(galleryId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No se pudo actualizar la galería, quizás fue eliminada ó no existe');
    expect(mockCount).toHaveBeenCalledWith({ where: { id: galleryId } });
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should activate a gallery', async () => {
    mockUpdate.mockResolvedValue({ title: 'Galería de Apertura', active: true });

    const response = await updateGalleryStateAction(galleryId, true);

    expect(response.ok).toBe(true);
    expect(response.message).toBe('La galería fue activada correctamente');
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: galleryId },
      data: { active: true },
      select: { title: true, active: true },
    });
    expect(updateTag).toHaveBeenCalledWith('admin-galleries');
    expect(updateTag).toHaveBeenCalledWith('public-galleries');
  });

  test('Should deactivate a gallery', async () => {
    mockUpdate.mockResolvedValue({ title: 'Galería de Apertura', active: false });

    const response = await updateGalleryStateAction(galleryId, false);

    expect(response.ok).toBe(true);
    expect(response.message).toBe('La galería fue desactivada correctamente');
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: galleryId },
      data: { active: false },
      select: { title: true, active: true },
    });
  });

  test('Should propagate errors because the action has no try/catch', async () => {
    mockCount.mockRejectedValue(new Error('DB connection failed'));

    await expect(updateGalleryStateAction(galleryId, true)).rejects.toThrow('DB connection failed');
  });

  test('Should propagate errors thrown by the update query', async () => {
    mockUpdate.mockRejectedValue(new Error('Update failed'));

    await expect(updateGalleryStateAction(galleryId, true)).rejects.toThrow('Update failed');
  });
});
