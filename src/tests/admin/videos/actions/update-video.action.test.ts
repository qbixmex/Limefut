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

import { updateVideoAction } from '@/app/admin/videos/(actions)/updateVideoAction';
import { Prisma } from '@/generated/prisma/client';
import { updateTag } from 'next/cache';
import { videoMock } from '../mocks/video.mock';

const videoId = '1f0e2d3c-4b5a-4968-8776-655443322110';
const publishedDate = new Date('2026-02-01T10:00:00.000Z');

const validFormData = (): FormData => {
  const formData = new FormData();
  formData.append('title', 'Video actualizado');
  formData.append('permalink', 'video-actualizado');
  formData.append('url', 'https://www.youtube.com/watch?v=xyz');
  formData.append('platform', 'youtube');
  formData.append('publishedDate', publishedDate.toISOString());
  formData.append('description', 'Descripción actualizada');
  formData.append('active', 'false');
  return formData;
};

const mockUpdatedVideo = {
  ...videoMock,
  id: videoId,
  title: 'Video actualizado',
  permalink: 'video-actualizado',
  publishedDate,
  description: 'Descripción actualizada',
  url: 'https://www.youtube.com/watch?v=xyz',
  platform: 'youtube',
  active: false,
};

const mockTx = {
  video: { count: vi.fn(), update: vi.fn() },
};

const queueCounts = (...values: number[]) => {
  mockTx.video.count.mockReset();
  values.forEach((value) => mockTx.video.count.mockResolvedValueOnce(value));
};

describe('Tests on updateVideoAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: 'b7e2ca32-af95-4750-bf63-6a338b236097', roles: ['admin'] },
    });
    queueCounts(1, 0, 0);
    mockTx.video.update.mockResolvedValue(mockUpdatedVideo);
    mockTransaction.mockImplementation((cb: (tx: typeof mockTx) => unknown) => cb(mockTx));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await updateVideoAction({ formData: validFormData(), videoId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(response.video).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c45414c0-044b-4319-acbb-45584a0839fa', roles: ['user'] },
    });

    const response = await updateVideoAction({ formData: validFormData(), videoId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.video).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: '9fb64c9c-f5d9-4391-95e1-1a11f9edfeef', roles: null },
    });

    const response = await updateVideoAction({ formData: validFormData(), videoId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.video).toBe(null);
  });

  test('Should return error when roles are empty', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c8ad7f64-4d9f-4f17-b73d-964894b3bf29', roles: [] },
    });

    const response = await updateVideoAction({ formData: validFormData(), videoId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.video).toBe(null);
  });

  test('Should return error when title is shorter than 3 characters', async () => {
    const formData = validFormData();
    formData.set('title', 'ab');

    const response = await updateVideoAction({ formData, videoId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('El título debe ser mayor a 3 caracteres');
    expect(response.video).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when permalink exceeds 200 characters', async () => {
    const formData = validFormData();
    formData.set('permalink', 'x'.repeat(201));

    const response = await updateVideoAction({ formData, videoId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('El enlace permanente debe ser menor a 200 caracteres');
    expect(response.video).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when url is too short', async () => {
    const formData = validFormData();
    formData.set('url', 'ab');

    const response = await updateVideoAction({ formData, videoId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('El URL debe ser mayor a 3 caracteres');
    expect(response.video).toBe(null);
  });

  test('Should return error when platform is missing', async () => {
    const formData = validFormData();
    formData.delete('platform');

    const response = await updateVideoAction({ formData, videoId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('La plataforma es obligatoria');
    expect(response.video).toBe(null);
  });

  test('Should return error when the description is too short', async () => {
    const formData = validFormData();
    formData.set('description', 'ab');

    const response = await updateVideoAction({ formData, videoId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('La descripción debe ser mayor a 3 caracteres');
    expect(response.video).toBe(null);
  });

  test('Should return error when the published date is missing', async () => {
    const formData = validFormData();
    formData.delete('publishedDate');

    const response = await updateVideoAction({ formData, videoId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Selecciona la fecha de publicación');
    expect(response.video).toBe(null);
  });

  test('Should return error when the video does not exist', async () => {
    queueCounts(0);

    const response = await updateVideoAction({ formData: validFormData(), videoId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('El video no existe o ha sido eliminado');
    expect(response.video).toBe(null);
    expect(mockTx.video.count).toHaveBeenCalledWith({ where: { id: videoId } });
    expect(mockTx.video.update).not.toHaveBeenCalled();
  });

  test('Should return error when the title is duplicated', async () => {
    queueCounts(1, 1);

    const response = await updateVideoAction({ formData: validFormData(), videoId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Ya existe un video con ese título');
    expect(response.video).toBe(null);
    expect(mockTx.video.update).not.toHaveBeenCalled();
  });

  test('Should return error when the permalink is duplicated', async () => {
    queueCounts(1, 0, 1);

    const response = await updateVideoAction({ formData: validFormData(), videoId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Ya existe un video con ese enlace permanente');
    expect(response.video).toBe(null);
    expect(mockTx.video.update).not.toHaveBeenCalled();
  });

  test('Should update a video successfully', async () => {
    const response = await updateVideoAction({ formData: validFormData(), videoId });

    expect(response.ok).toBe(true);
    expect(response.message).toBe('El video fue actualizado correctamente');
    expect(response.video).toEqual(mockUpdatedVideo);
    expect(mockTx.video.update).toHaveBeenCalledOnce();
    expect(mockTx.video.update).toHaveBeenCalledWith({
      where: { id: videoId },
      data: {
        title: 'Video actualizado',
        permalink: 'video-actualizado',
        publishedDate,
        url: 'https://www.youtube.com/watch?v=xyz',
        platform: 'youtube',
        description: 'Descripción actualizada',
        active: false,
      },
    });
    expect(updateTag).toHaveBeenCalledWith('admin-videos');
    expect(updateTag).toHaveBeenCalledWith('admin-video');
    expect(updateTag).toHaveBeenCalledWith('public-videos');
    expect(updateTag).toHaveBeenCalledWith('public-video');
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockTx.video.update.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: 'test',
        meta: { modelName: 'Video', target: ['title'] },
      }),
    );

    const response = await updateVideoAction({ formData: validFormData(), videoId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('El campo "title", está duplicado');
    expect(response.video).toBe(null);
  });

  test('Should return error on error carrying meta (non P2002)', async () => {
    mockTx.video.update.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
        clientVersion: 'test',
        meta: { modelName: 'Video', target: ['id'] },
      }),
    );

    const response = await updateVideoAction({ formData: validFormData(), videoId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error al actualizar el video, revise los logs del servidor');
    expect(response.video).toBe(null);
  });

  test('Should return error on unexpected Error instance inside transaction', async () => {
    mockTx.video.update.mockRejectedValue(new Error('Something went wrong'));

    const response = await updateVideoAction({ formData: validFormData(), videoId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error inesperado, revise los logs');
    expect(response.video).toBe(null);
  });

  test('Should return error when the count query rejects inside transaction', async () => {
    mockTx.video.count.mockReset();
    mockTx.video.count.mockRejectedValue(new Error('DB connection failed'));

    const response = await updateVideoAction({ formData: validFormData(), videoId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error inesperado, revise los logs');
    expect(response.video).toBe(null);
  });

  test('Should return error when transaction rejects', async () => {
    mockTransaction.mockRejectedValue(new Error('Transaction failed'));

    const response = await updateVideoAction({ formData: validFormData(), videoId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error inesperado, revise los logs del servidor');
    expect(response.video).toBe(null);
  });

  test('Should return error on unknown transaction error', async () => {
    mockTransaction.mockRejectedValue('Something unexpected');

    const response = await updateVideoAction({ formData: validFormData(), videoId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error inesperado, revise los logs del servidor');
    expect(response.video).toBe(null);
  });
});
