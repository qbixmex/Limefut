const {
  mockTransaction,
  mockGetSession,
  mockUploadImage,
  MockPrismaClientKnownRequestError,
} = vi.hoisted(() => {
  class MockPrismaClientKnownRequestError extends Error {
    code: string;
    meta?: Record<string, unknown>;

    constructor(message: string, options: { code: string; meta?: Record<string, unknown> }) {
      super(message);
      this.name = 'PrismaClientKnownRequestError';
      this.code = options.code;
      this.meta = options.meta;
    }
  }

  return {
    mockTransaction: vi.fn(),
    mockGetSession: vi.fn(),
    mockUploadImage: vi.fn(),
    MockPrismaClientKnownRequestError,
  };
});

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

vi.mock('@/generated/prisma/client', () => ({
  Prisma: {
    PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
  },
}));

vi.mock('@/shared/actions', () => ({
  uploadImage: mockUploadImage,
  deleteImage: vi.fn(),
}));

import { createAnnouncementAction } from '@/app/admin/noticias/(actions)/createAnnouncementAction';
import { updateTag } from 'next/cache';

const publishedDate = new Date('2026-01-15T12:00:00.000Z');

const validFormData = (): FormData => {
  const formData = new FormData();
  formData.append('title', 'Noticia de prueba');
  formData.append('permalink', 'noticia-de-prueba');
  formData.append('publishedDate', publishedDate.toISOString());
  formData.append('description', 'Descripción de prueba');
  formData.append('content', 'Contenido de la noticia');
  formData.append('active', 'true');
  return formData;
};

const mockCreatedAnnouncement = {
  id: '1f0e2d3c-4b5a-4968-8776-655443322110',
  title: 'Noticia de prueba',
  permalink: 'noticia-de-prueba',
  description: 'Descripción de prueba',
  content: 'Contenido de la noticia',
  publishedDate,
  imageUrl: null,
  imagePublicID: null,
  active: true,
};

const mockTx = {
  announcement: { create: vi.fn() },
};

describe('Tests on createAnnouncementAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: 'b7e2ca32-af95-4750-bf63-6a338b236097', roles: ['admin'] },
    });
    mockTx.announcement.create.mockResolvedValue(mockCreatedAnnouncement);
    mockTransaction.mockImplementation((cb: (tx: typeof mockTx) => unknown) => cb(mockTx));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await createAnnouncementAction({ formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(response.announcement).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c45414c0-044b-4319-acbb-45584a0839fa', roles: ['user'] },
    });

    const response = await createAnnouncementAction({ formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.announcement).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: '9fb64c9c-f5d9-4391-95e1-1a11f9edfeef', roles: null },
    });

    const response = await createAnnouncementAction({ formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.announcement).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when roles are empty', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c8ad7f64-4d9f-4f17-b73d-964894b3bf29', roles: [] },
    });

    const response = await createAnnouncementAction({ formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.announcement).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when title is shorter than 3 characters', async () => {
    const formData = validFormData();
    formData.set('title', 'ab');

    const response = await createAnnouncementAction({ formData });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('El título debe ser mayor a 3 caracteres');
    expect(response.announcement).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when title exceeds 200 characters', async () => {
    const formData = validFormData();
    formData.set('title', 'x'.repeat(201));

    const response = await createAnnouncementAction({ formData });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('El título debe ser menor a 200 caracteres');
    expect(response.announcement).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when permalink is shorter than 3 characters', async () => {
    const formData = validFormData();
    formData.set('permalink', 'ab');

    const response = await createAnnouncementAction({ formData });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('El nombre debe ser mayor a 3 caracteres');
    expect(response.announcement).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when permalink exceeds 200 characters', async () => {
    const formData = validFormData();
    formData.set('permalink', 'x'.repeat(201));

    const response = await createAnnouncementAction({ formData });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('El nombre debe ser menor a 200 caracteres');
    expect(response.announcement).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when published date is missing', async () => {
    const formData = validFormData();
    formData.delete('publishedDate');

    const response = await createAnnouncementAction({ formData });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Selecciona la fecha de publicación');
    expect(response.announcement).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when description is shorter than 3 characters', async () => {
    const formData = validFormData();
    formData.set('description', 'ab');

    const response = await createAnnouncementAction({ formData });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('La descripción debe ser mayor a 3 caracteres');
    expect(response.announcement).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when description exceeds 250 characters', async () => {
    const formData = validFormData();
    formData.set('description', 'x'.repeat(251));

    const response = await createAnnouncementAction({ formData });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('La descripción debe ser menor a 250 caracteres');
    expect(response.announcement).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when content is shorter than 4 characters', async () => {
    const formData = validFormData();
    formData.set('content', 'abc');

    const response = await createAnnouncementAction({ formData });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('El contenido debe ser mayor a 8 caracteres');
    expect(response.announcement).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when the image type is not accepted', async () => {
    const formData = validFormData();
    formData.append('image', new File(['content'], 'nota.txt', { type: 'text/plain' }));

    const response = await createAnnouncementAction({ formData });

    expect(response.ok).toBe(false);
    expect(response.message).toBe(
      'El tipo de archivo debe ser uno de los siguientes: png, jpeg, jpg, gif, webp',
    );
    expect(response.announcement).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when the image is too large', async () => {
    const formData = validFormData();
    formData.append(
      'image',
      new File([new Uint8Array(1024 * 1024 * 2 + 1)], 'grande.png', { type: 'image/png' }),
    );

    const response = await createAnnouncementAction({ formData });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('El tamaño máximo de la imagen deber ser menor a 2 mb');
    expect(response.announcement).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should create an announcement successfully without an image', async () => {
    const response = await createAnnouncementAction({ formData: validFormData() });

    expect(response.ok).toBe(true);
    expect(response.message).toBe('Noticia creada satisfactoriamente');
    expect(response.announcement).toEqual(mockCreatedAnnouncement);
    expect(mockUploadImage).not.toHaveBeenCalled();
    expect(mockTx.announcement.create).toHaveBeenCalledOnce();
    expect(mockTx.announcement.create).toHaveBeenCalledWith({
      data: {
        title: 'Noticia de prueba',
        permalink: 'noticia-de-prueba',
        description: 'Descripción de prueba',
        content: 'Contenido de la noticia',
        publishedDate,
        active: true,
        imageUrl: undefined,
        imagePublicID: undefined,
      },
    });
    expect(updateTag).toHaveBeenCalledWith('admin-announcements');
    expect(updateTag).toHaveBeenCalledWith('admin-announcement');
    expect(updateTag).toHaveBeenCalledWith('public-announcements');
  });

  test('Should upload the image and persist its data when provided', async () => {
    mockUploadImage.mockResolvedValue({
      publicId: 'announcements/noticia-prueba',
      secureUrl: 'https://res.cloudinary.com/demo/image/upload/v1/announcements/noticia-prueba.webp',
    });

    const formData = validFormData();
    formData.append('image', new File(['content'], 'noticia.png', { type: 'image/png' }));

    const response = await createAnnouncementAction({ formData });

    expect(response.ok).toBe(true);
    expect(mockUploadImage).toHaveBeenCalledOnce();
    expect(mockTx.announcement.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/announcements/noticia-prueba.webp',
        imagePublicID: 'announcements/noticia-prueba',
      }),
    });
  });

  test('Should throw when the image upload fails', async () => {
    mockUploadImage.mockResolvedValue(null);

    const formData = validFormData();
    formData.append('image', new File(['content'], 'noticia.png', { type: 'image/png' }));

    await expect(createAnnouncementAction({ formData })).rejects.toThrow(
      'Error subiendo imagen a cloudinary',
    );
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockTx.announcement.create.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: { modelName: 'Announcement', target: ['permalink'] },
      }),
    );

    const response = await createAnnouncementAction({ formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Hay campos duplicados, revise los logs del servidor');
    expect(response.announcement).toBe(null);
  });

  test('Should return error on prisma known error (non P2002)', async () => {
    mockTx.announcement.create.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
        meta: { modelName: 'Announcement', target: ['id'] },
      }),
    );

    const response = await createAnnouncementAction({ formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error al crear la noticia, revise los logs del servidor');
    expect(response.announcement).toBe(null);
  });

  test('Should return error on unexpected Error instance', async () => {
    mockTx.announcement.create.mockRejectedValue(new Error('Something went wrong'));

    const response = await createAnnouncementAction({ formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error inesperado, revise los logs del servidor');
    expect(response.announcement).toBe(null);
  });

  test('Should return error on unknown error', async () => {
    mockTx.announcement.create.mockRejectedValue('Something unexpected');

    const response = await createAnnouncementAction({ formData: validFormData() });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error inesperado, revise los logs del servidor');
    expect(response.announcement).toBe(null);
  });
});
