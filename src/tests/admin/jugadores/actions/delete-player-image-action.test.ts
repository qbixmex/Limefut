const {
  MockPrismaClientKnownRequestError,
  mockFindUnique,
  mockUpdate,
  mockDeleteImage,
  mockGetSession,
} = vi.hoisted(() => {
  class MockPrismaClientKnownRequestError extends Error {
    code: string;
    meta?: Record<string, unknown>;
    constructor(
      message: string,
      options: { code: string; meta?: Record<string, unknown> },
    ) {
      super(message);
      this.name = 'PrismaClientKnownRequestError';
      this.code = options.code;
      this.meta = options.meta;
    }
  }
  return {
    MockPrismaClientKnownRequestError,
    mockFindUnique: vi.fn(),
    mockUpdate: vi.fn(),
    mockDeleteImage: vi.fn(),
    mockGetSession: vi.fn(),
  };
});

vi.mock('next/cache');

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('@/lib/auth', () => ({
  auth: {
    api: {
      getSession: mockGetSession,
    },
  },
}));

vi.mock('@/lib/prisma', () => ({
  default: {
    player: {
      findUnique: mockFindUnique,
      update: mockUpdate,
    },
  },
}));

vi.mock('@/shared/actions/deleteImageAction', () => ({
  default: mockDeleteImage,
}));

vi.mock('@/generated/prisma/client', () => ({
  Prisma: {
    PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
  },
}));

import { deletePlayerImageAction } from '@/app/admin/jugadores/(actions)/deletePlayerImageAction';

const playerId = 'c93a8c24-ca76-493c-b1e3-f533454bbdae';

const mockPlayerNoImage = {
  name: 'Juan Pérez',
  imagePublicID: null,
};

const mockPlayerWithImage = {
  name: 'Juan Pérez',
  imagePublicID: 'cloudinary-public-id',
};

describe('Tests on delete player image server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['admin'] },
    });
    mockFindUnique.mockResolvedValue(mockPlayerNoImage);
    mockUpdate.mockResolvedValue({ id: playerId });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await deletePlayerImageAction({
      playerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ Debes estar autentificado para realizar esta acción !');
    expect(mockFindUnique).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['user'] },
    });

    const response = await deletePlayerImageAction({
      playerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(mockFindUnique).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: null },
    });

    const response = await deletePlayerImageAction({
      playerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(mockFindUnique).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is empty', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: [] },
    });

    const response = await deletePlayerImageAction({
      playerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(mockFindUnique).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when player does not exist', async () => {
    mockFindUnique.mockResolvedValue(null);

    const response = await deletePlayerImageAction({
      playerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no existe/i);
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: playerId },
      select: {
        name: true,
        imagePublicID: true,
      },
    });
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should delete player image without cloudinary image', async () => {
    const response = await deletePlayerImageAction({
      playerId,
    });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/juan pérez/i);
    expect(response.message).toMatch(/eliminada/i);

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: playerId },
      select: {
        name: true,
        imagePublicID: true,
      },
    });
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: playerId },
      data: {
        imageUrl: null,
        imagePublicID: null,
      },
    });
    expect(mockDeleteImage).not.toHaveBeenCalled();
  });

  test('Should delete player image with cloudinary image', async () => {
    mockFindUnique.mockResolvedValue(mockPlayerWithImage);
    mockDeleteImage.mockResolvedValue({ ok: true });

    const response = await deletePlayerImageAction({
      playerId,
    });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/juan pérez/i);
    expect(mockDeleteImage).toHaveBeenCalledWith('cloudinary-public-id');
  });

  test('Should throw when cloudinary image deletion fails', async () => {
    mockFindUnique.mockResolvedValue(mockPlayerWithImage);
    mockDeleteImage.mockResolvedValue({ ok: false });

    await expect(
      deletePlayerImageAction({
        playerId,
      }),
    ).rejects.toThrow('cloudinary');
    expect(mockDeleteImage).toHaveBeenCalledWith('cloudinary-public-id');
  });

  test('Should return error on prisma known error (P2002)', async () => {
    mockUpdate.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: { target: ['name'] },
      }),
    );

    const response = await deletePlayerImageAction({
      playerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/unique constraint/i);
  });

  test('Should return error on generic error', async () => {
    mockUpdate.mockRejectedValue(new Error('Database connection lost'));

    const response = await deletePlayerImageAction({
      playerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no se pudo eliminar la imagen/i);
  });

  test('Should return error on unknown error', async () => {
    mockUpdate.mockRejectedValue('Some non-error object');

    const response = await deletePlayerImageAction({
      playerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
  });
});
