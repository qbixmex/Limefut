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

import { createVideoAction } from '@/app/admin/videos/(actions)/createVideoAction';
import { Prisma } from '@/generated/prisma/client';
import { updateTag } from 'next/cache';
import { videoMock } from '../mocks/video.mock';

const publishedDate = new Date('2026-01-15T12:00:00.000Z');

const validFormData = (): FormData => {
  const formData = new FormData();
  formData.append('title', 'Video de prueba');
  formData.append('permalink', 'video-de-prueba');
  formData.append('url', 'https://www.youtube.com/watch?v=abc');
  formData.append('platform', 'youtube');
  formData.append('publishedDate', publishedDate.toISOString());
  formData.append('description', 'Descripción de prueba');
  formData.append('active', 'true');
  return formData;
};

const mockCreatedVideo = videoMock;

const mockTx = {
  video: {
    create: vi.fn(),
    count: vi.fn(),
    update: vi.fn(),
    findFirst: vi.fn(),
  },
};

describe('Tests on createVideoAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: 'b7e2ca32-af95-4750-bf63-6a338b236097', roles: ['admin'] },
    });
    mockTx.video.create.mockResolvedValue(mockCreatedVideo);
    mockTransaction.mockImplementation((cb: (tx: typeof mockTx) => unknown) => cb(mockTx));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await createVideoAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(response.video).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c45414c0-044b-4319-acbb-45584a0839fa', roles: ['user'] },
    });

    const response = await createVideoAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.video).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: '9fb64c9c-f5d9-4391-95e1-1a11f9edfeef', roles: null },
    });

    const response = await createVideoAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.video).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when roles are empty', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c8ad7f64-4d9f-4f17-b73d-964894b3bf29', roles: [] },
    });

    const response = await createVideoAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(response.video).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when title is shorter than 3 characters', async () => {
    const formData = validFormData();
    formData.set('title', 'ab');

    const response = await createVideoAction(formData);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('El título debe ser mayor a 3 caracteres');
    expect(response.video).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when title exceeds 200 characters', async () => {
    const formData = validFormData();
    formData.set('title', 'x'.repeat(201));

    const response = await createVideoAction(formData);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('El título debe ser menor a 200 caracteres');
    expect(response.video).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when permalink is shorter than 3 characters', async () => {
    const formData = validFormData();
    formData.set('permalink', 'ab');

    const response = await createVideoAction(formData);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('El enlace permanente debe ser mayor a 3 caracteres');
    expect(response.video).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when permalink exceeds 200 characters', async () => {
    const formData = validFormData();
    formData.set('permalink', 'x'.repeat(201));

    const response = await createVideoAction(formData);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('El enlace permanente debe ser menor a 200 caracteres');
    expect(response.video).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when url is shorter than 3 characters', async () => {
    const formData = validFormData();
    formData.set('url', 'ab');

    const response = await createVideoAction(formData);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('El URL debe ser mayor a 3 caracteres');
    expect(response.video).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when platform is missing', async () => {
    const formData = validFormData();
    formData.delete('platform');

    const response = await createVideoAction(formData);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('La plataforma es obligatoria');
    expect(response.video).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when published date is missing', async () => {
    const formData = validFormData();
    formData.delete('publishedDate');

    const response = await createVideoAction(formData);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Selecciona la fecha de publicación');
    expect(response.video).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when description is shorter than 3 characters', async () => {
    const formData = validFormData();
    formData.set('description', 'ab');

    const response = await createVideoAction(formData);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('La descripción debe ser mayor a 3 caracteres');
    expect(response.video).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when description exceeds 250 characters', async () => {
    const formData = validFormData();
    formData.set('description', 'x'.repeat(251));

    const response = await createVideoAction(formData);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('La descripción debe ser menor a 250 caracteres');
    expect(response.video).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should create a video successfully', async () => {
    const response = await createVideoAction(validFormData());

    expect(response.ok).toBe(true);
    expect(response.message).toBe('Video creado satisfactoriamente');
    expect(response.video).toEqual(mockCreatedVideo);
    expect(mockTx.video.create).toHaveBeenCalledOnce();
    expect(mockTx.video.create).toHaveBeenCalledWith({
      data: {
        title: 'Video de prueba',
        permalink: 'video-de-prueba',
        url: 'https://www.youtube.com/watch?v=abc',
        platform: 'youtube',
        publishedDate,
        description: 'Descripción de prueba',
        active: true,
      },
    });
    expect(updateTag).toHaveBeenCalledWith('admin-videos');
    expect(updateTag).toHaveBeenCalledWith('admin-video');
    expect(updateTag).toHaveBeenCalledWith('public-videos');
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockTx.video.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: 'test',
        meta: { modelName: 'Video', target: ['permalink'] },
      }),
    );

    const response = await createVideoAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Hay campos duplicados, revise los logs del servidor');
    expect(response.video).toBe(null);
  });

  test('Should return error on error carrying meta (non P2002)', async () => {
    mockTx.video.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
        clientVersion: 'test',
        meta: { modelName: 'Video', target: ['id'] },
      }),
    );

    const response = await createVideoAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Hubo errores de base de datos, revise los logs del servidor');
    expect(response.video).toBe(null);
  });

  test('Should return error on unexpected Error instance', async () => {
    mockTx.video.create.mockRejectedValue(new Error('Something went wrong'));

    const response = await createVideoAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No se pudo crear el video, revise los logs del servidor');
    expect(response.video).toBe(null);
  });

  test('Should return error on unknown error', async () => {
    mockTx.video.create.mockRejectedValue('Something unexpected');

    const response = await createVideoAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error inesperado, revise los logs del servidor');
    expect(response.video).toBe(null);
  });

  test('Should return error when transaction rejects', async () => {
    mockTransaction.mockRejectedValue(new Error('Transaction failed'));

    const response = await createVideoAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No se pudo crear el video, revise los logs del servidor');
    expect(response.video).toBe(null);
  });

  test('Should return error on unknown transaction error', async () => {
    mockTransaction.mockRejectedValue('Something unexpected');

    const response = await createVideoAction(validFormData());

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error inesperado, revise los logs del servidor');
    expect(response.video).toBe(null);
  });
});
