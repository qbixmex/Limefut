const {
  MockPrismaClientKnownRequestError,
  mockTransaction,
  mockUploadImage,
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
    mockTransaction: vi.fn(),
    mockUploadImage: vi.fn(),
  };
});

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    $transaction: mockTransaction,
  },
}));

vi.mock('@/shared/actions', () => ({
  uploadImage: mockUploadImage,
}));

vi.mock('@/generated/prisma/client', () => ({
  Prisma: {
    PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
  },
}));

import { createPlayerAction } from '@/app/admin/jugadores/(actions)/createPlayerAction';

const validFormData = (): FormData => {
  const formData = new FormData();
  formData.append('name', 'Juan Pérez');
  formData.append('email', 'juan@email.com');
  formData.append('phone', '555-1234');
  formData.append('nationality', 'Mexicana');
  formData.append('birthday', '2000-01-15');
  formData.append('active', 'true');
  formData.append(
    'teamId',
    'f784c643-c39f-4867-9d7c-9b5c571a84c4',
  );
  return formData;
};

const mockCreatedPlayer = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  name: 'Juan Pérez',
  email: 'juan@email.com',
  phone: '555-1234',
  birthday: new Date('2000-01-15'),
  nationality: 'Mexicana',
  imageUrl: null,
  imagePublicID: null,
  active: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-06-15'),
};

const mockTx = {
  player: { create: vi.fn() },
};

describe('Tests on createPlayerAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockTx.player.create.mockResolvedValue(mockCreatedPlayer);
    mockTransaction.mockImplementation(
      (cb: (tx: typeof mockTx) => unknown) => cb(mockTx),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when authenticatedUserId is undefined', async () => {
    const response = await createPlayerAction({
      authenticatedUserId: undefined,
      authenticatedUserRoles: ['user', 'admin'],
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/autentificado/i);
    expect(response.player).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    const response = await createPlayerAction({
      authenticatedUserId: 'ecc10b39-fb57-49d6-856b-31c4098be95a',
      authenticatedUserRoles: ['user'],
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(response.player).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when roles is null', async () => {
    const response = await createPlayerAction({
      authenticatedUserId: 'ecc10b39-fb57-49d6-856b-31c4098be95a',
      authenticatedUserRoles: null,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(response.player).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when roles are empty', async () => {
    const response = await createPlayerAction({
      authenticatedUserId: '19fafe1d-6847-450c-a5a7-80f61c80ed4f',
      authenticatedUserRoles: [],
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(response.player).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when zod validation fails (short name)', async () => {
    const formData = validFormData();
    formData.set('name', 'ab');

    const response = await createPlayerAction({
      authenticatedUserId: '7ab083c7-9389-4842-8735-1dd283eaf3c4',
      authenticatedUserRoles: ['user', 'admin'],
      formData,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/nombre/i);
    expect(response.player).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should create a player without image', async () => {
    const response = await createPlayerAction({
      authenticatedUserId: 'dbcf3107-c2bb-4f9f-ba4d-152ac918d93c',
      authenticatedUserRoles: ['user', 'admin'],
      formData: validFormData(),
    });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/correctamente/i);
    expect(response.player).not.toBe(null);
    expect(response.player?.id).toBe(mockCreatedPlayer.id);
    expect(response.player?.name).toBe(mockCreatedPlayer.name);
    expect(response.player?.imageUrl).toBe(null);
    expect(response.player?.imagePublicID).toBe(null);

    expect(mockTransaction).toHaveBeenCalled();
    expect(mockTx.player.create).toHaveBeenCalledOnce();
    expect(mockTx.player.create).toHaveBeenCalledWith({
      data: {
        name: 'Juan Pérez',
        email: 'juan@email.com',
        phone: '555-1234',
        nationality: 'Mexicana',
        birthday: new Date('2000-01-15'),
        active: true,
        teamId: 'f784c643-c39f-4867-9d7c-9b5c571a84c4',
        imageUrl: null,
        imagePublicID: null,
      },
    });
  });

  test('Should create a player with image', async () => {
    mockUploadImage.mockResolvedValue({
      secureUrl: 'https://res.cloudinary.com/test/image.jpg',
      publicId: 'test-public-id',
    });

    const formData = validFormData();
    const imageFile = new File([''], 'test.png', { type: 'image/png' });
    formData.append('image', imageFile);

    const response = await createPlayerAction({
      authenticatedUserId: '9e16e6ff-d20b-408c-b316-7d3edaeb66f9',
      authenticatedUserRoles: ['user', 'admin'],
      formData,
    });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/correctamente/i);

    expect(mockUploadImage).toHaveBeenCalledWith(imageFile, 'players');
    expect(mockTransaction).toHaveBeenCalled();

    expect(mockTx.player.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          imageUrl: 'https://res.cloudinary.com/test/image.jpg',
          imagePublicID: 'test-public-id',
        }),
      }),
    );
  });

  test('Should throw when image upload fails', async () => {
    mockUploadImage.mockResolvedValue(null);

    const formData = validFormData();
    const imageFile = new File([''], 'test.png', { type: 'image/png' });
    formData.append('image', imageFile);

    await expect(
      createPlayerAction({
        authenticatedUserId: 'fb5b126d-31fd-477a-b190-09c5d266be69',
        authenticatedUserRoles: ['admin'],
        formData,
      }),
    ).rejects.toThrow('cloudinary');
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockTransaction.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: { modelName: 'Player', target: ['email'] },
      }),
    );

    const response = await createPlayerAction({
      authenticatedUserId: '987df461-89c3-4050-bf44-4d4dc4a3e9a1',
      authenticatedUserRoles: ['user', 'admin'],
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/email/i);
    expect(response.message).toMatch(/duplicado/i);
    expect(response.player).toBe(null);
  });

  test('Should return generic prisma error for non-P2002 codes', async () => {
    mockTransaction.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
        meta: { modelName: 'Player', target: ['teamId'] },
      }),
    );

    const response = await createPlayerAction({
      authenticatedUserId: 'fdbd8d2f-ece3-4cb7-9417-b3e4b4086399',
      authenticatedUserRoles: ['user', 'admin'],
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error al crear el jugador/i);
    expect(response.player).toBe(null);
  });

  test('Should return error on unexpected error', async () => {
    mockTransaction.mockRejectedValue(new Error('Something went wrong'));

    const response = await createPlayerAction({
      authenticatedUserId: '14b74b98-bba8-4798-be65-a002fb1912d9',
      authenticatedUserRoles: ['user', 'admin'],
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.player).toBe(null);
  });
});
