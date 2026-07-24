const {
  MockPrismaClientKnownRequestError,
  mockFindUnique,
  mockDelete,
  mockDeleteImage,
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
  };
});

vi.mock('next/cache');

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
const authUserId = '4c20f4f2-21f5-47ca-9b4a-dafe2335a993';

const mockPlayerNoImage = {
  name: 'Juan Pérez',
  imagePublicID: null,
  _count: { penaltyKicks: 0 },
};

describe('Tests on delete player server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockFindUnique.mockResolvedValue(mockPlayerNoImage);
    mockDelete.mockResolvedValue({ id: playerId });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when authenticated user id is undefined', async () => {
    const response = await deletePlayerAction({
      playerId,
      authenticatedUserId: undefined,
      authenticatedUserRoles: [],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/autentificado/i);
    expect(mockFindUnique).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user id is null', async () => {
    const response = await deletePlayerAction({
      playerId,
      authenticatedUserId: null,
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/autentificado/i);
    expect(mockFindUnique).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is null', async () => {
    const response = await deletePlayerAction({
      playerId,
      authenticatedUserId: authUserId,
      authenticatedUserRoles: null,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockFindUnique).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles does not include admin', async () => {
    const response = await deletePlayerAction({
      playerId,
      authenticatedUserId: authUserId,
      authenticatedUserRoles: ['user'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockFindUnique).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is empty', async () => {
    const response = await deletePlayerAction({
      playerId,
      authenticatedUserId: authUserId,
      authenticatedUserRoles: [],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockFindUnique).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when player does not exist', async () => {
    mockFindUnique.mockResolvedValue(null);

    const response = await deletePlayerAction({
      playerId,
      authenticatedUserId: authUserId,
      authenticatedUserRoles: ['user', 'admin'],
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
      authenticatedUserId: authUserId,
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/penales/i);
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should delete a player without image', async () => {
    const response = await deletePlayerAction({
      playerId,
      authenticatedUserId: authUserId,
      authenticatedUserRoles: ['user', 'admin'],
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
      authenticatedUserId: authUserId,
      authenticatedUserRoles: ['user', 'admin'],
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
        authenticatedUserId: authUserId,
        authenticatedUserRoles: ['user', 'admin'],
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
      authenticatedUserId: authUserId,
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/unique constraint/i);
  });

  test('Should return error on generic error', async () => {
    mockDelete.mockRejectedValue(new Error('Database connection lost'));

    const response = await deletePlayerAction({
      playerId,
      authenticatedUserId: authUserId,
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/logs del servidor/i);
  });

  test('Should return error on unknown error', async () => {
    mockDelete.mockRejectedValue('Some non-error object');

    const response = await deletePlayerAction({
      playerId,
      authenticatedUserId: authUserId,
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error del servidor no esperado/i);
  });
});
