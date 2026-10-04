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

import { createGalleryAction } from '@/app/admin/galerias/(actions)/createGalleryAction';
import { updateTag } from 'next/cache';

const galleryDate = new Date('2026-01-15T12:00:00.000Z');

const validFormData = (): FormData => {
  const formData = new FormData();
  formData.append('title', 'Galería Test');
  formData.append('permalink', 'galeria-test');
  formData.append('galleryDate', galleryDate.toISOString());
  formData.append('active', 'true');
  return formData;
};

const mockCreatedGallery = {
  id: '1f0e2d3c-4b5a-4968-8776-655443322110',
  title: 'Galería Test',
  permalink: 'galeria-test',
  galleryDate,
  active: true,
};

const mockTx = {
  gallery: { create: vi.fn() },
};

describe('Tests on createGalleryAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: 'b7e2ca32-af95-4750-bf63-6a338b236097', roles: ['admin'] },
    });
    mockTx.gallery.create.mockResolvedValue(mockCreatedGallery);
    mockTransaction.mockImplementation((cb: (tx: typeof mockTx) => unknown) => cb(mockTx));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await createGalleryAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(response.gallery).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c45414c0-044b-4319-acbb-45584a0839fa', roles: ['user'] },
    });

    const response = await createGalleryAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.gallery).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: '9fb64c9c-f5d9-4391-95e1-1a11f9edfeef', roles: null },
    });

    const response = await createGalleryAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.gallery).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when roles are empty', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c8ad7f64-4d9f-4f17-b73d-964894b3bf29', roles: [] },
    });

    const response = await createGalleryAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.gallery).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when title is shorter than 3 characters', async () => {
    const formData = validFormData();
    formData.set('title', 'ab');

    const response = await createGalleryAction(formData);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/nombre debe ser mayor a 3 caracteres/i);
    expect(response.gallery).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when title exceeds 50 characters', async () => {
    const formData = validFormData();
    formData.set('title', 'x'.repeat(51));

    const response = await createGalleryAction(formData);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/nombre debe ser menor a 50 caracteres/i);
    expect(response.gallery).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when permalink is shorter than 3 characters', async () => {
    const formData = validFormData();
    formData.set('permalink', 'ab');

    const response = await createGalleryAction(formData);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/enlace permanente debe ser mayor a 3 caracteres/i);
    expect(response.gallery).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when permalink exceeds 100 characters', async () => {
    const formData = validFormData();
    formData.set('permalink', 'x'.repeat(101));

    const response = await createGalleryAction(formData);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/enlace permanente debe ser menor a 100 caracteres/i);
    expect(response.gallery).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when gallery date is invalid', async () => {
    const formData = validFormData();
    formData.set('galleryDate', '');

    const response = await createGalleryAction(formData);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/fecha/i);
    expect(response.gallery).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should create a gallery successfully', async () => {
    const response = await createGalleryAction(validFormData());

    expect(response.ok).toBe(true);
    expect(response.message).toBe('Galería creada satisfactoriamente');
    expect(response.gallery).toEqual(mockCreatedGallery);
    expect(mockTx.gallery.create).toHaveBeenCalledOnce();
    expect(mockTx.gallery.create).toHaveBeenCalledWith({
      data: {
        title: 'Galería Test',
        permalink: 'galeria-test',
        galleryDate,
        active: true,
      },
    });
    expect(updateTag).toHaveBeenCalledWith('admin-galleries');
    expect(updateTag).toHaveBeenCalledWith('public-galleries');
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockTransaction.mockRejectedValue(
      Object.assign(new Error('Unique constraint failed'), {
        code: 'P2002',
        meta: { modelName: 'Gallery', target: ['permalink'] },
      }),
    );

    const response = await createGalleryAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('El campo "permalink", está duplicado');
    expect(response.gallery).toBe(null);
  });

  test('Should return error on prisma known error with meta (non P2002)', async () => {
    mockTransaction.mockRejectedValue(
      Object.assign(new Error('Foreign key constraint failed'), {
        code: 'P2003',
        meta: { modelName: 'Gallery', target: ['id'] },
      }),
    );

    const response = await createGalleryAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error al crear la galería, revise los logs del servidor');
    expect(response.gallery).toBe(null);
  });

  test('Should return error on unexpected Error instance', async () => {
    mockTransaction.mockRejectedValue(new Error('Something went wrong'));

    const response = await createGalleryAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error inesperado, revise los logs del servidor');
    expect(response.gallery).toBe(null);
  });

  test('Should return error on unknown error', async () => {
    mockTransaction.mockRejectedValue('Something unexpected');

    const response = await createGalleryAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error inesperado, revise los logs del servidor');
    expect(response.gallery).toBe(null);
  });
});
