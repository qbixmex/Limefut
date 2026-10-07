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
    video: {
      count: mockCount,
      update: mockUpdate,
    },
  },
}));

import { updateVideoStateAction } from '@/app/admin/videos/(actions)/updateVideoStateAction';
import { Prisma } from '@/generated/prisma/client';
import { updateTag } from 'next/cache';

const videoId = '1f0e2d3c-4b5a-4968-8776-655443322110';

describe('Tests on updateVideoStateAction server action', () => {
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

    const response = await updateVideoStateAction(videoId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(mockCount).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c45414c0-044b-4319-acbb-45584a0839fa', roles: ['user'] },
    });

    const response = await updateVideoStateAction(videoId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: '9fb64c9c-f5d9-4391-95e1-1a11f9edfeef', roles: null },
    });

    const response = await updateVideoStateAction(videoId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when roles are empty', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c8ad7f64-4d9f-4f17-b73d-964894b3bf29', roles: [] },
    });

    const response = await updateVideoStateAction(videoId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when the video does not exist', async () => {
    mockCount.mockResolvedValue(0);

    const response = await updateVideoStateAction(videoId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe(
      'No se pudo actualizar el video, quizás fue eliminado ó no existe',
    );
    expect(mockCount).toHaveBeenCalledWith({ where: { id: videoId } });
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should activate a video', async () => {
    mockUpdate.mockResolvedValue({ active: true });

    const response = await updateVideoStateAction(videoId, true);

    expect(response.ok).toBe(true);
    expect(response.message).toBe('El video fue activado correctamente');
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: videoId },
      data: { active: true },
      select: { active: true },
    });
    expect(updateTag).toHaveBeenCalledWith('admin-videos');
    expect(updateTag).toHaveBeenCalledWith('admin-video');
    expect(updateTag).toHaveBeenCalledWith('public-videos');
    expect(updateTag).toHaveBeenCalledWith('public-video');
  });

  test('Should deactivate a video', async () => {
    mockUpdate.mockResolvedValue({ active: false });

    const response = await updateVideoStateAction(videoId, false);

    expect(response.ok).toBe(true);
    expect(response.message).toBe('El video fue desactivado correctamente');
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: videoId },
      data: { active: false },
      select: { active: true },
    });
  });

  test('Should return error when the count query fails', async () => {
    mockCount.mockRejectedValue(new Error('DB connection failed'));

    const response = await updateVideoStateAction(videoId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No se pudo actualizar el video, revise los logs del servidor');
  });

  test('Should return error when the update query fails', async () => {
    mockUpdate.mockRejectedValue(new Error('DB update failed'));

    const response = await updateVideoStateAction(videoId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No se pudo actualizar el video, revise los logs del servidor');
  });

  test('Should return error on a known Prisma request error', async () => {
    mockUpdate.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Database error', {
        code: 'P2003',
        clientVersion: 'test',
        meta: { modelName: 'Video' },
      }),
    );

    const response = await updateVideoStateAction(videoId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Hubo errores de base de datos, revise los logs del servidor');
  });

  test('Should return error on an unknown error', async () => {
    mockUpdate.mockRejectedValue('Something unexpected');

    const response = await updateVideoStateAction(videoId, true);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error inesperado, revise los logs del servidor');
  });
});
