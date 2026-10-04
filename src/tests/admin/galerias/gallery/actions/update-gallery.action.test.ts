const { mockTransaction, mockGetSession } = vi.hoisted(() => ({
  mockTransaction: vi.fn(),
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
    $transaction: mockTransaction,
  },
}));

import { updateGalleryAction } from '@/app/admin/galerias/(actions)/gallery/update-gallery.action';
import { updateTag } from 'next/cache';

const galleryId = '1f0e2d3c-4b5a-4968-8776-655443322110';
const galleryDate = new Date('2026-02-01T10:00:00.000Z');

const validFormData = (): FormData => {
  const formData = new FormData();
  formData.append('title', 'Galería Actualizada');
  formData.append('permalink', 'galeria-actualizada');
  formData.append('galleryDate', galleryDate.toISOString());
  formData.append('active', 'false');
  return formData;
};

const mockUpdatedGallery = {
  id: galleryId,
  title: 'Galería Actualizada',
  permalink: 'galeria-actualizada',
  galleryDate,
  active: false,
};

const mockTx = {
  gallery: { count: vi.fn(), update: vi.fn() },
};

describe('Tests on updateGalleryAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: 'b7e2ca32-af95-4750-bf63-6a338b236097', roles: ['admin'] },
    });
    mockTx.gallery.count.mockResolvedValue(1);
    mockTx.gallery.update.mockResolvedValue(mockUpdatedGallery);
    mockTransaction.mockImplementation((cb: (tx: typeof mockTx) => unknown) => cb(mockTx));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await updateGalleryAction({ formData: validFormData(), galleryId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(response.gallery).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c45414c0-044b-4319-acbb-45584a0839fa', roles: ['user'] },
    });

    const response = await updateGalleryAction({ formData: validFormData(), galleryId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.gallery).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: '9fb64c9c-f5d9-4391-95e1-1a11f9edfeef', roles: null },
    });

    const response = await updateGalleryAction({ formData: validFormData(), galleryId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.gallery).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when roles are empty', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c8ad7f64-4d9f-4f17-b73d-964894b3bf29', roles: [] },
    });

    const response = await updateGalleryAction({ formData: validFormData(), galleryId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.gallery).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when title is shorter than 3 characters', async () => {
    const formData = validFormData();
    formData.set('title', 'ab');

    const response = await updateGalleryAction({ formData, galleryId });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/nombre debe ser mayor a 3 caracteres/i);
    expect(response.gallery).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when permalink exceeds 100 characters', async () => {
    const formData = validFormData();
    formData.set('permalink', 'x'.repeat(101));

    const response = await updateGalleryAction({ formData, galleryId });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/enlace permanente debe ser menor a 100 caracteres/i);
    expect(response.gallery).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when gallery does not exist', async () => {
    mockTx.gallery.count.mockResolvedValue(0);

    const response = await updateGalleryAction({ formData: validFormData(), galleryId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('La galería no existe o ha sido eliminada');
    expect(response.gallery).toBe(null);
    expect(mockTx.gallery.count).toHaveBeenCalledWith({ where: { id: galleryId } });
    expect(mockTx.gallery.update).not.toHaveBeenCalled();
  });

  test('Should update a gallery successfully (permalink is not persisted)', async () => {
    const response = await updateGalleryAction({ formData: validFormData(), galleryId });

    expect(response.ok).toBe(true);
    expect(response.message).toBe('La galería fue actualizada correctamente');
    expect(response.gallery).toEqual(mockUpdatedGallery);
    expect(mockTx.gallery.update).toHaveBeenCalledOnce();
    expect(mockTx.gallery.update).toHaveBeenCalledWith({
      where: { id: galleryId },
      data: {
        title: 'Galería Actualizada',
        galleryDate,
        active: false,
      },
    });
    expect(updateTag).toHaveBeenCalledWith('admin-galleries');
    expect(updateTag).toHaveBeenCalledWith('public-gallery');
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockTx.gallery.update.mockRejectedValue(
      Object.assign(new Error('Unique constraint failed'), {
        code: 'P2002',
        meta: { modelName: 'Gallery', target: ['title'] },
      }),
    );

    const response = await updateGalleryAction({ formData: validFormData(), galleryId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('El campo "title", está duplicado');
    expect(response.gallery).toBe(null);
  });

  test('Should return error on prisma known error with meta (non P2002)', async () => {
    mockTx.gallery.update.mockRejectedValue(
      Object.assign(new Error('Foreign key constraint failed'), {
        code: 'P2003',
        meta: { modelName: 'Gallery', target: ['id'] },
      }),
    );

    const response = await updateGalleryAction({ formData: validFormData(), galleryId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error al actualizar la galería, revise los logs del servidor');
    expect(response.gallery).toBe(null);
  });

  test('Should return error on unexpected Error instance inside transaction', async () => {
    mockTx.gallery.update.mockRejectedValue(new Error('Something went wrong'));

    const response = await updateGalleryAction({ formData: validFormData(), galleryId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error inesperado, revise los logs');
    expect(response.gallery).toBe(null);
  });

  test('Should return error when transaction rejects', async () => {
    mockTransaction.mockRejectedValue(new Error('Transaction failed'));

    const response = await updateGalleryAction({ formData: validFormData(), galleryId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error inesperado, revise los logs del servidor');
    expect(response.gallery).toBe(null);
  });

  test('Should return error on unknown transaction error', async () => {
    mockTransaction.mockRejectedValue('Something unexpected');

    const response = await updateGalleryAction({ formData: validFormData(), galleryId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error inesperado, revise los logs del servidor');
    expect(response.gallery).toBe(null);
  });
});
