const { mockCount, mockUpdate, mockGetSession, MockPrismaClientKnownRequestError } = vi.hoisted(
  () => {
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
      mockCount: vi.fn(),
      mockUpdate: vi.fn(),
      mockGetSession: vi.fn(),
      MockPrismaClientKnownRequestError,
    };
  },
);

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
      count: mockCount,
      update: mockUpdate,
    },
  },
}));

vi.mock('@/generated/prisma/client', () => ({
  Prisma: {
    PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
  },
}));

import { updateAnnouncementStateAction } from '@/app/admin/noticias/(actions)/updateAnnouncementStateAction';
import { updateTag } from 'next/cache';

const announcementId = '1f0e2d3c-4b5a-4968-8776-655443322110';

describe('Tests on updateAnnouncementStateAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: 'b7e2ca32-af95-4750-bf63-6a338b236097', roles: ['admin'] },
    });
    mockCount.mockResolvedValue(1);
    mockUpdate.mockResolvedValue({ active: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await updateAnnouncementStateAction(announcementId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c45414c0-044b-4319-acbb-45584a0839fa', roles: ['user'] },
    });

    const response = await updateAnnouncementStateAction(announcementId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: '9fb64c9c-f5d9-4391-95e1-1a11f9edfeef', roles: null },
    });

    const response = await updateAnnouncementStateAction(announcementId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when roles are empty', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c8ad7f64-4d9f-4f17-b73d-964894b3bf29', roles: [] },
    });

    const response = await updateAnnouncementStateAction(announcementId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when the announcement does not exist', async () => {
    mockCount.mockResolvedValue(0);

    const response = await updateAnnouncementStateAction(announcementId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe(
      'No se pudo actualizar la noticia, quizás fue eliminada ó no existe',
    );
    expect(mockCount).toHaveBeenCalledWith({ where: { id: announcementId } });
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should activate an announcement', async () => {
    mockUpdate.mockResolvedValue({ active: true });

    const response = await updateAnnouncementStateAction(announcementId, true);

    expect(response.ok).toBe(true);
    expect(response.message).toBe('La noticia fue activado correctamente');
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: announcementId },
      data: { active: true },
      select: { active: true },
    });
    expect(updateTag).toHaveBeenCalledWith('admin-announcements');
    expect(updateTag).toHaveBeenCalledWith('admin-announcement');
    expect(updateTag).toHaveBeenCalledWith('public-announcements');
  });

  test('Should deactivate an announcement', async () => {
    mockUpdate.mockResolvedValue({ active: false });

    const response = await updateAnnouncementStateAction(announcementId, false);

    expect(response.ok).toBe(true);
    expect(response.message).toBe('La noticia fue desactivado correctamente');
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: announcementId },
      data: { active: false },
      select: { active: true },
    });
  });

  test('Should return error on prisma known error', async () => {
    mockUpdate.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Record to update not found', { code: 'P2025' }),
    );

    const response = await updateAnnouncementStateAction(announcementId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error al actualizar la noticia, revise los logs del servidor');
  });

  test('Should return error on unexpected Error instance', async () => {
    mockUpdate.mockRejectedValue(new Error('Something went wrong'));

    const response = await updateAnnouncementStateAction(announcementId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error inesperado, revise los logs del servidor');
  });

  test('Should return error on unknown error', async () => {
    mockUpdate.mockRejectedValue('Something unexpected');

    const response = await updateAnnouncementStateAction(announcementId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error desconocido, revise los logs del servidor');
  });

  test('Should propagate errors thrown by the count query (no try/catch)', async () => {
    mockCount.mockRejectedValue(new Error('DB connection failed'));

    await expect(updateAnnouncementStateAction(announcementId, true)).rejects.toThrow(
      'DB connection failed',
    );
  });
});
