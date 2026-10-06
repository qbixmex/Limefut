const {
  mockFindFirst,
  mockDelete,
  mockDeleteImage,
  mockGetSession,
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
    mockFindFirst: vi.fn(),
    mockDelete: vi.fn(),
    mockDeleteImage: vi.fn(),
    mockGetSession: vi.fn(),
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
    announcement: {
      findFirst: mockFindFirst,
      delete: mockDelete,
    },
  },
}));

vi.mock('@/generated/prisma/client', () => ({
  Prisma: {
    PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
  },
}));

vi.mock('@/shared/actions', () => ({
  deleteImage: mockDeleteImage,
  uploadImage: vi.fn(),
}));

import { deleteAnnouncementAction } from '@/app/admin/noticias/(actions)/deleteAnnouncementAction';
import { updateTag } from 'next/cache';

const announcementId = '1f0e2d3c-4b5a-4968-8776-655443322110';

describe('Tests on deleteAnnouncementAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: 'b7e2ca32-af95-4750-bf63-6a338b236097', roles: ['admin'] },
    });
    mockFindFirst.mockResolvedValue({
      title: 'Noticia de Apertura',
      imagePublicID: null,
    });
    mockDelete.mockResolvedValue({ id: announcementId });
    mockDeleteImage.mockResolvedValue({ ok: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await deleteAnnouncementAction(announcementId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(mockFindFirst).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c45414c0-044b-4319-acbb-45584a0839fa', roles: ['user'] },
    });

    const response = await deleteAnnouncementAction(announcementId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: '9fb64c9c-f5d9-4391-95e1-1a11f9edfeef', roles: null },
    });

    const response = await deleteAnnouncementAction(announcementId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when roles are empty', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c8ad7f64-4d9f-4f17-b73d-964894b3bf29', roles: [] },
    });

    const response = await deleteAnnouncementAction(announcementId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when the announcement does not exist', async () => {
    mockFindFirst.mockResolvedValue(null);

    const response = await deleteAnnouncementAction(announcementId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe(
      'No se puede eliminar la noticia, quizás fue eliminada ó no existe',
    );
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { id: announcementId },
      select: { title: true, imagePublicID: true },
    });
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should delete an announcement successfully without an image', async () => {
    const response = await deleteAnnouncementAction(announcementId);

    expect(response.ok).toBe(true);
    expect(response.message).toBe('La noticia ha sido eliminada correctamente');
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: announcementId } });
    expect(mockDeleteImage).not.toHaveBeenCalled();
    expect(updateTag).toHaveBeenCalledWith('admin-announcements');
    expect(updateTag).toHaveBeenCalledWith('admin-announcement');
    expect(updateTag).toHaveBeenCalledWith('public-announcements');
  });

  test('Should delete the announcement image from cloudinary when present', async () => {
    mockFindFirst.mockResolvedValue({
      title: 'Noticia de Apertura',
      imagePublicID: 'announcements/noticia-apertura',
    });

    const response = await deleteAnnouncementAction(announcementId);

    expect(response.ok).toBe(true);
    expect(mockDeleteImage).toHaveBeenCalledWith('announcements/noticia-apertura');
  });

  test('Should return error when the image cannot be deleted from cloudinary', async () => {
    mockFindFirst.mockResolvedValue({
      title: 'Noticia de Apertura',
      imagePublicID: 'announcements/noticia-apertura',
    });
    mockDeleteImage.mockResolvedValue({ ok: false });

    const response = await deleteAnnouncementAction(announcementId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error inesperado, revise los logs del servidor');
  });

  test('Should return error on Prisma P2001', async () => {
    mockDelete.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Not found', { code: 'P2001' }),
    );

    const response = await deleteAnnouncementAction(announcementId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No se encuentra la noticia en la bse de datos');
  });

  test('Should return error on prisma known error (non P2001)', async () => {
    mockDelete.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Foreign key constraint failed', { code: 'P2003' }),
    );

    const response = await deleteAnnouncementAction(announcementId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error al eliminar la noticia, revise los logs del servidor');
  });

  test('Should return error on unexpected Error instance', async () => {
    mockDelete.mockRejectedValue(new Error('Something went wrong'));

    const response = await deleteAnnouncementAction(announcementId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error inesperado, revise los logs del servidor');
  });

  test('Should return error on unknown error', async () => {
    mockDelete.mockRejectedValue('Something unexpected');

    const response = await deleteAnnouncementAction(announcementId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error desconocido, revise los logs del servidor');
  });

  test('Should propagate errors thrown by the findFirst query (no try/catch)', async () => {
    mockFindFirst.mockRejectedValue(new Error('DB connection failed'));

    await expect(deleteAnnouncementAction(announcementId)).rejects.toThrow('DB connection failed');
  });
});
