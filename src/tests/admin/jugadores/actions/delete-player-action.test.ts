const {
  MockPrismaClientKnownRequestError,
  mockFindUnique,
  mockDelete,
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
    mockDelete: vi.fn(),
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
      delete: mockDelete,
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

import { deletePlayerAction } from '@/app/admin/jugadores/(actions)/deletePlayerAction';

const playerId = 'c93a8c24-ca76-493c-b1e3-f533454bbdae';

const mockPlayerNoImage = {
  name: 'Juan Pérez',
  imagePublicID: null,
  _count: { penaltyKicks: 0 },
};

describe('Tests on delete player server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['admin'] },
    });
    mockFindUnique.mockResolvedValue(mockPlayerNoImage);
    mockDelete.mockResolvedValue({ id: playerId });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await deletePlayerAction({
      playerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ Debes estar autentificado para realizar esta acción !');
    expect(mockFindUnique).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['user'] },
    });

    const response = await deletePlayerAction({
      playerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(mockFindUnique).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: null },
    });

    const response = await deletePlayerAction({
      playerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(mockFindUnique).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is empty', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: [] },
    });

    const response = await deletePlayerAction({
      playerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(mockFindUnique).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when player does not exist', async () => {
    mockFindUnique.mockResolvedValue(null);

    const response = await deletePlayerAction({
      playerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no existe/i);
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: playerId },
      select: {
        imagePublicID: true,
        name: true,
        _count: {
          select: {
            penaltyKicks: true,
          },
        },
      },
    });
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when player has penalty kicks', async () => {
    mockFindUnique.mockResolvedValue({
      name: 'Juan Pérez',
      imagePublicID: null,
      _count: { penaltyKicks: 3 },
    });

    const response = await deletePlayerAction({
      playerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/penales/i);
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should delete a player without image', async () => {
    const response = await deletePlayerAction({
      playerId,
    });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/juan pérez/i);
    expect(response.message).toMatch(/eliminado/i);

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: playerId },
      select: {
        imagePublicID: true,
        name: true,
        _count: {
          select: {
            penaltyKicks: true,
          },
        },
      },
    });
    expect(mockDelete).toHaveBeenCalledWith({
      where: { id: playerId },
    });
    expect(mockDeleteImage).not.toHaveBeenCalled();
  });

  test('Should delete a player with image and delete from cloudinary', async () => {
    mockFindUnique.mockResolvedValue({
      name: 'Juan Pérez',
      imagePublicID: 'cloudinary-public-id',
      _count: { penaltyKicks: 0 },
    });
    mockDeleteImage.mockResolvedValue({ ok: true });

    const response = await deletePlayerAction({
      playerId,
    });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/juan pérez/i);
    expect(mockDeleteImage).toHaveBeenCalledWith('cloudinary-public-id');
  });

  test('Should throw when cloudinary image deletion fails', async () => {
    mockFindUnique.mockResolvedValue({
      name: 'Juan Pérez',
      imagePublicID: 'cloudinary-public-id',
      _count: { penaltyKicks: 0 },
    });
    mockDeleteImage.mockResolvedValue({ ok: false });

    await expect(
      deletePlayerAction({
        playerId,
      }),
    ).rejects.toThrow('cloudinary');
    expect(mockDeleteImage).toHaveBeenCalledWith('cloudinary-public-id');
  });

  test('Should return error on prisma known error (P2002)', async () => {
    mockDelete.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: { target: ['name'] },
      }),
    );

    const response = await deletePlayerAction({
      playerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/unique constraint/i);
  });

  test('Should return error on generic error', async () => {
    mockDelete.mockRejectedValue(new Error('Database connection lost'));

    const response = await deletePlayerAction({
      playerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/logs del servidor/i);
  });

  test('Should return error on unknown error', async () => {
    mockDelete.mockRejectedValue('Some non-error object');

    const response = await deletePlayerAction({
      playerId,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error del servidor no esperado/i);
  });
});
