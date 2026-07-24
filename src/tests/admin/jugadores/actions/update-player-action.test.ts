const {
  MockPrismaClientKnownRequestError,
  mockTransaction,
  mockUploadImage,
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
    mockTransaction: vi.fn(),
    mockUploadImage: vi.fn(),
    mockDeleteImage: vi.fn(),
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
  deleteImage: mockDeleteImage,
}));

vi.mock('@/generated/prisma/client', () => ({
  Prisma: {
    PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
  },
}));

import { updatePlayerAction } from '@/app/admin/jugadores/(actions)/updatePlayerAction';

const playerId = '550e8400-e29b-41d4-a716-446655440001';

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

const mockUpdatedPlayer = {
  id: playerId,
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
  player: {
    count: vi.fn(),
    update: vi.fn(),
  },
};

describe('Tests on update player action server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockTx.player.count.mockResolvedValue(1);
    mockTx.player.update.mockResolvedValue(mockUpdatedPlayer);
    mockTransaction.mockImplementation(
      (cb: (tx: typeof mockTx) => unknown) => cb(mockTx),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when authenticated user id is undefined', async () => {
    const response = await updatePlayerAction({
      playerId,
      authenticatedUserId: undefined,
      authenticatedUserRoles: ['user', 'admin'],
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/autentificado/i);
    expect(response.player).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user id is null', async () => {
    const response = await updatePlayerAction({
      playerId,
      authenticatedUserId: null,
      authenticatedUserRoles: ['user', 'admin'],
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/autentificado/i);
    expect(response.player).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is null', async () => {
    const response = await updatePlayerAction({
      playerId,
      authenticatedUserId: 'ecc10b39-fb57-49d6-856b-31c4098be95a',
      authenticatedUserRoles: null,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(response.player).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles does not include admin', async () => {
    const response = await updatePlayerAction({
      playerId,
      authenticatedUserId: 'ecc10b39-fb57-49d6-856b-31c4098be95a',
      authenticatedUserRoles: ['user'],
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(response.player).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is empty', async () => {
    const response = await updatePlayerAction({
      playerId,
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

    const response = await updatePlayerAction({
      playerId,
      authenticatedUserId: '7ab083c7-9389-4842-8735-1dd283eaf3c4',
      authenticatedUserRoles: ['user', 'admin'],
      formData,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/nombre/i);
    expect(response.player).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when player does not exist', async () => {
    mockTx.player.count.mockResolvedValue(0);

    const response = await updatePlayerAction({
      playerId,
      authenticatedUserId: 'dbcf3107-c2bb-4f9f-ba4d-152ac918d93c',
      authenticatedUserRoles: ['user', 'admin'],
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('no existe');
    expect(response.player).toBe(null);
    expect(mockTx.player.update).not.toHaveBeenCalled();
  });

  test('Should update a player without image', async () => {
    const response = await updatePlayerAction({
      playerId,
      authenticatedUserId: 'dbcf3107-c2bb-4f9f-ba4d-152ac918d93c',
      authenticatedUserRoles: ['user', 'admin'],
      formData: validFormData(),
    });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/correctamente/i);
    expect(response.player).not.toBe(null);
    expect(response.player?.id).toBe(mockUpdatedPlayer.id);
    expect(response.player?.name).toBe(mockUpdatedPlayer.name);

    expect(mockTransaction).toHaveBeenCalled();
    expect(mockTx.player.count).toHaveBeenCalledWith({
      where: { id: playerId },
    });
    expect(mockTx.player.update).toHaveBeenCalledTimes(1);
    expect(mockTx.player.update).toHaveBeenCalledWith({
      where: { id: playerId },
      data: {
        name: 'Juan Pérez',
        email: 'juan@email.com',
        phone: '555-1234',
        nationality: 'Mexicana',
        birthday: new Date('2000-01-15'),
        active: true,
        teamId: 'f784c643-c39f-4867-9d7c-9b5c571a84c4',
      },
    });
  });

  test('Should update a player with image replacement', async () => {
    mockTx.player.update.mockResolvedValue({
      ...mockUpdatedPlayer,
      imageUrl: 'https://res.cloudinary.com/old/image.jpg',
      imagePublicID: 'old-public-id',
    });
    mockDeleteImage.mockResolvedValue({ ok: true });
    mockUploadImage.mockResolvedValue({
      secureUrl: 'https://res.cloudinary.com/new/image.jpg',
      publicId: 'new-public-id',
    });

    const formData = validFormData();
    const imageFile = new File([''], 'test.png', { type: 'image/png' });
    formData.append('image', imageFile);

    const response = await updatePlayerAction({
      playerId,
      authenticatedUserId: '9e16e6ff-d20b-408c-b316-7d3edaeb66f9',
      authenticatedUserRoles: ['user', 'admin'],
      formData,
    });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/correctamente/i);

    expect(mockDeleteImage).toHaveBeenCalledWith('old-public-id');
    expect(mockUploadImage).toHaveBeenCalledWith(imageFile, 'coaches');
    expect(mockTx.player.update).toHaveBeenCalledTimes(2);
  });

  test('Should update a player with image when no previous image exists', async () => {
    mockTx.player.update.mockResolvedValue(mockUpdatedPlayer);
    mockUploadImage.mockResolvedValue({
      secureUrl: 'https://res.cloudinary.com/new/image.jpg',
      publicId: 'new-public-id',
    });

    const formData = validFormData();
    const imageFile = new File([''], 'test.png', { type: 'image/png' });
    formData.append('image', imageFile);

    const response = await updatePlayerAction({
      playerId,
      authenticatedUserId: '9e16e6ff-d20b-408c-b316-7d3edaeb66f9',
      authenticatedUserRoles: ['user', 'admin'],
      formData,
    });

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/correctamente/i);

    expect(mockDeleteImage).not.toHaveBeenCalled();
    expect(mockUploadImage).toHaveBeenCalledWith(imageFile, 'coaches');
    expect(mockTx.player.update).toHaveBeenCalledTimes(2);
  });

  test('Should return error when deleteImage fails', async () => {
    mockTx.player.update.mockResolvedValue({
      ...mockUpdatedPlayer,
      imageUrl: 'https://res.cloudinary.com/old/image.jpg',
      imagePublicID: 'old-public-id',
    });
    mockDeleteImage.mockResolvedValue({ ok: false });

    const formData = validFormData();
    const imageFile = new File([''], 'test.png', { type: 'image/png' });
    formData.append('image', imageFile);

    const response = await updatePlayerAction({
      playerId,
      authenticatedUserId: 'fb5b126d-31fd-477a-b190-09c5d266be69',
      authenticatedUserRoles: ['admin'],
      formData,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/Error inesperado, revise los logs !/i);
    expect(response.player).toBe(null);
    expect(mockDeleteImage).toHaveBeenCalledWith('old-public-id');
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockTx.player.update.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: { modelName: 'Player', target: ['email'] },
      }),
    );

    const response = await updatePlayerAction({
      playerId,
      authenticatedUserId: '987df461-89c3-4050-bf44-4d4dc4a3e9a1',
      authenticatedUserRoles: ['user', 'admin'],
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('email');
    expect(response.message).toContain('duplicado');
    expect(response.player).toBe(null);
  });

  test('Should return generic prisma error for non-P2002 codes', async () => {
    mockTx.player.update.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
        meta: { modelName: 'Player', target: ['teamId'] },
      }),
    );

    const response = await updatePlayerAction({
      playerId,
      authenticatedUserId: 'fdbd8d2f-ece3-4cb7-9417-b3e4b4086399',
      authenticatedUserRoles: ['user', 'admin'],
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Error al actualizar el jugador');
    expect(response.player).toBe(null);
  });

  test('Should return error on unexpected error inside transaction', async () => {
    mockTx.player.update.mockRejectedValue(new Error('Something went wrong'));

    const response = await updatePlayerAction({
      playerId,
      authenticatedUserId: '14b74b98-bba8-4798-be65-a002fb1912d9',
      authenticatedUserRoles: ['user', 'admin'],
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.player).toBe(null);
  });

  test.skip('Should return error when transaction itself rejects', async () => {
    mockTransaction.mockRejectedValue(new Error('Infrastructure failure'));

    const response = await updatePlayerAction({
      playerId,
      authenticatedUserId: 'b08bbbc1-0191-4561-932f-eaeef6a6b4ba',
      authenticatedUserRoles: ['user', 'admin'],
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.player).toBe(null);
  });
});
