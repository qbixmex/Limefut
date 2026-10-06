const {
  mockTransaction,
  mockGetSession,
  mockUploadImage,
  mockDeleteImage,
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
    mockDeleteImage: vi.fn(),
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
  deleteImage: mockDeleteImage,
}));

import { updateAnnouncementAction } from '@/app/admin/noticias/(actions)/updateAnnouncementAction';
import { updateTag } from 'next/cache';

const announcementId = '1f0e2d3c-4b5a-4968-8776-655443322110';
const publishedDate = new Date('2026-02-01T10:00:00.000Z');

const validFormData = (): FormData => {
  const formData = new FormData();
  formData.append('title', 'Noticia actualizada');
  formData.append('permalink', 'noticia-actualizada');
  formData.append('publishedDate', publishedDate.toISOString());
  formData.append('description', 'Descripción actualizada');
  formData.append('content', 'Contenido actualizado');
  formData.append('active', 'false');
  return formData;
};

const mockUpdatedAnnouncement = {
  id: announcementId,
  title: 'Noticia actualizada',
  permalink: 'noticia-actualizada',
  description: 'Descripción actualizada',
  content: 'Contenido actualizado',
  publishedDate,
  imageUrl: null,
  imagePublicID: null,
  active: false,
};

const mockTx = {
  announcement: { count: vi.fn(), update: vi.fn() },
};

const queueCounts = (...values: number[]) => {
  mockTx.announcement.count.mockReset();
  values.forEach((value) => mockTx.announcement.count.mockResolvedValueOnce(value));
};

describe('Tests on updateAnnouncementAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: 'b7e2ca32-af95-4750-bf63-6a338b236097', roles: ['admin'] },
    });
    queueCounts(1, 0, 0);
    mockTx.announcement.update.mockResolvedValue(mockUpdatedAnnouncement);
    mockTransaction.mockImplementation((cb: (tx: typeof mockTx) => unknown) => cb(mockTx));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await updateAnnouncementAction({ formData: validFormData(), announcementId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(response.announcement).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c45414c0-044b-4319-acbb-45584a0839fa', roles: ['user'] },
    });

    const response = await updateAnnouncementAction({ formData: validFormData(), announcementId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.announcement).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: '9fb64c9c-f5d9-4391-95e1-1a11f9edfeef', roles: null },
    });

    const response = await updateAnnouncementAction({ formData: validFormData(), announcementId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.announcement).toBe(null);
  });

  test('Should return error when roles are empty', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c8ad7f64-4d9f-4f17-b73d-964894b3bf29', roles: [] },
    });

    const response = await updateAnnouncementAction({ formData: validFormData(), announcementId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.announcement).toBe(null);
  });

  test('Should return error when title is shorter than 3 characters', async () => {
    const formData = validFormData();
    formData.set('title', 'ab');

    const response = await updateAnnouncementAction({ formData, announcementId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('El título debe ser mayor a 3 caracteres');
    expect(response.announcement).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when permalink exceeds 200 characters', async () => {
    const formData = validFormData();
    formData.set('permalink', 'x'.repeat(201));

    const response = await updateAnnouncementAction({ formData, announcementId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('El nombre debe ser menor a 200 caracteres');
    expect(response.announcement).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when the description is too short', async () => {
    const formData = validFormData();
    formData.set('description', 'ab');

    const response = await updateAnnouncementAction({ formData, announcementId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('La descripción debe ser mayor a 3 caracteres');
    expect(response.announcement).toBe(null);
  });

  test('Should return error when the content is too short', async () => {
    const formData = validFormData();
    formData.set('content', 'abc');

    const response = await updateAnnouncementAction({ formData, announcementId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('El contenido debe ser mayor a 8 caracteres');
    expect(response.announcement).toBe(null);
  });

  test('Should return error when the published date is missing', async () => {
    const formData = validFormData();
    formData.delete('publishedDate');

    const response = await updateAnnouncementAction({ formData, announcementId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Selecciona la fecha de publicación');
    expect(response.announcement).toBe(null);
  });

  test('Should return error when the announcement does not exist', async () => {
    queueCounts(0);

    const response = await updateAnnouncementAction({ formData: validFormData(), announcementId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('La noticia no existe o ha sido eliminado');
    expect(response.announcement).toBe(null);
    expect(mockTx.announcement.count).toHaveBeenCalledWith({ where: { id: announcementId } });
    expect(mockTx.announcement.update).not.toHaveBeenCalled();
  });

  test('Should return error when the title is duplicated', async () => {
    queueCounts(1, 1);

    const response = await updateAnnouncementAction({ formData: validFormData(), announcementId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Ya existe una noticia con ese título');
    expect(response.announcement).toBe(null);
    expect(mockTx.announcement.update).not.toHaveBeenCalled();
  });

  test('Should return error when the permalink is duplicated', async () => {
    queueCounts(1, 0, 1);

    const response = await updateAnnouncementAction({ formData: validFormData(), announcementId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Ya existe una noticia con ese enlace permanente');
    expect(response.announcement).toBe(null);
    expect(mockTx.announcement.update).not.toHaveBeenCalled();
  });

  test('Should update an announcement successfully', async () => {
    const response = await updateAnnouncementAction({ formData: validFormData(), announcementId });

    expect(response.ok).toBe(true);
    expect(response.message).toBe('La noticia fue actualizada correctamente');
    expect(response.announcement).toEqual(mockUpdatedAnnouncement);
    expect(mockTx.announcement.update).toHaveBeenCalledOnce();
    expect(mockTx.announcement.update).toHaveBeenCalledWith({
      where: { id: announcementId },
      data: {
        title: 'Noticia actualizada',
        permalink: 'noticia-actualizada',
        description: 'Descripción actualizada',
        content: 'Contenido actualizado',
        publishedDate,
        active: false,
      },
      select: {
        id: true,
        title: true,
        permalink: true,
        description: true,
        content: true,
        publishedDate: true,
        imageUrl: true,
        imagePublicID: true,
        active: true,
      },
    });
    expect(updateTag).toHaveBeenCalledWith('admin-announcements');
    expect(updateTag).toHaveBeenCalledWith('admin-announcement');
    expect(updateTag).toHaveBeenCalledWith('public-announcements');
    expect(updateTag).toHaveBeenCalledWith('public-announcement');
  });

  test('Should replace the image when a new file is provided', async () => {
    mockTx.announcement.update.mockResolvedValueOnce({
      ...mockUpdatedAnnouncement,
      imagePublicID: 'announcements/old-image',
    });
    mockDeleteImage.mockResolvedValue({ ok: true });
    mockUploadImage.mockResolvedValue({
      publicId: 'announcements/new-image',
      secureUrl: 'https://res.cloudinary.com/demo/image/upload/v1/announcements/new-image.webp',
    });

    const formData = validFormData();
    formData.append('image', new File(['content'], 'nueva.png', { type: 'image/png' }));

    const response = await updateAnnouncementAction({ formData, announcementId });

    expect(response.ok).toBe(true);
    expect(mockDeleteImage).toHaveBeenCalledWith('announcements/old-image');
    expect(mockUploadImage).toHaveBeenCalledOnce();
    expect(mockTx.announcement.update).toHaveBeenCalledTimes(2);
    expect(mockTx.announcement.update).toHaveBeenLastCalledWith({
      where: { id: announcementId },
      data: {
        imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/announcements/new-image.webp',
        imagePublicID: 'announcements/new-image',
      },
    });
    expect(response.announcement).toEqual(
      expect.objectContaining({
        imageUrl: 'https://res.cloudinary.com/demo/image/upload/v1/announcements/new-image.webp',
        imagePublicID: 'announcements/new-image',
      }),
    );
  });

  test('Should return error when the previous image cannot be deleted', async () => {
    mockTx.announcement.update.mockResolvedValueOnce({
      ...mockUpdatedAnnouncement,
      imagePublicID: 'announcements/old-image',
    });
    mockDeleteImage.mockResolvedValue({ ok: false });

    const formData = validFormData();
    formData.append('image', new File(['content'], 'nueva.png', { type: 'image/png' }));

    const response = await updateAnnouncementAction({ formData, announcementId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error inesperado, revise los logs del servidor');
    expect(response.announcement).toBe(null);
    expect(mockUploadImage).not.toHaveBeenCalled();
  });

  test('Should return error when the image upload fails', async () => {
    mockTx.announcement.update.mockResolvedValueOnce({
      ...mockUpdatedAnnouncement,
      imagePublicID: null,
    });
    mockUploadImage.mockResolvedValue(null);

    const formData = validFormData();
    formData.append('image', new File(['content'], 'nueva.png', { type: 'image/png' }));

    const response = await updateAnnouncementAction({ formData, announcementId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error inesperado, revise los logs del servidor');
    expect(response.announcement).toBe(null);
  });

  test('Should return error on Prisma P2001', async () => {
    mockTx.announcement.update.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Not found', { code: 'P2001' }),
    );

    const response = await updateAnnouncementAction({ formData: validFormData(), announcementId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No se encuentra la noticia en la bse de datos');
    expect(response.announcement).toBe(null);
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockTx.announcement.update.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: { modelName: 'Announcement', target: ['title'] },
      }),
    );

    const response = await updateAnnouncementAction({ formData: validFormData(), announcementId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Hay campos duplicados, revise los logs del servidor');
    expect(response.announcement).toBe(null);
  });

  test('Should return error on prisma known error (non P2001/P2002)', async () => {
    mockTx.announcement.update.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
        meta: { modelName: 'Announcement', target: ['id'] },
      }),
    );

    const response = await updateAnnouncementAction({ formData: validFormData(), announcementId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error al actualizar la noticia, revise los logs del servidor');
    expect(response.announcement).toBe(null);
  });

  test('Should return error on unexpected Error instance inside transaction', async () => {
    mockTx.announcement.update.mockRejectedValue(new Error('Something went wrong'));

    const response = await updateAnnouncementAction({ formData: validFormData(), announcementId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error inesperado, revise los logs del servidor');
    expect(response.announcement).toBe(null);
  });

  test('Should return error when transaction rejects', async () => {
    mockTransaction.mockRejectedValue(new Error('Transaction failed'));

    const response = await updateAnnouncementAction({ formData: validFormData(), announcementId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error inesperado, revise los logs del servidor');
    expect(response.announcement).toBe(null);
  });

  test('Should return error on unknown transaction error', async () => {
    mockTransaction.mockRejectedValue('Something unexpected');

    const response = await updateAnnouncementAction({ formData: validFormData(), announcementId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error inesperado, revise los logs del servidor');
    expect(response.announcement).toBe(null);
  });
});
