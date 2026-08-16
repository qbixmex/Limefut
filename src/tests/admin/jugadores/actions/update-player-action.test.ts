const {
  MockPrismaClientKnownRequestError,
  mockTransaction,
  mockUploadImage,
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
    mockTransaction: vi.fn(),
    mockUploadImage: vi.fn(),
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
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['admin'] },
    });
    mockTx.player.count.mockResolvedValue(1);
    mockTx.player.update.mockResolvedValue(mockUpdatedPlayer);
    mockTransaction.mockImplementation(
      (cb: (tx: typeof mockTx) => unknown) => cb(mockTx),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await updatePlayerAction({
      playerId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ Debes estar autentificado para realizar esta acción !');
    expect(response.player).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['user'] },
    });

    const response = await updatePlayerAction({
      playerId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(response.player).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: null },
    });

    const response = await updatePlayerAction({
      playerId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(response.player).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is empty', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: [] },
    });

    const response = await updatePlayerAction({
      playerId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(response.player).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when zod validation fails (short name)', async () => {
    const formData = validFormData();
    formData.set('name', 'ab');

    const response = await updatePlayerAction({
      playerId,
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
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no existe/i);
    expect(response.player).toBe(null);
    expect(mockTx.player.update).not.toHaveBeenCalled();
  });

  test('Should update a player without image', async () => {
    const response = await updatePlayerAction({
      playerId,
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
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/email/i);
    expect(response.message).toMatch(/duplicado/i);
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
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error al actualizar el jugador/i);
    expect(response.player).toBe(null);
  });

  test('Should return error on unexpected error inside transaction', async () => {
    mockTx.player.update.mockRejectedValue(new Error('Something went wrong'));

    const response = await updatePlayerAction({
      playerId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.player).toBe(null);
  });

  test('Should return error when transaction itself rejects', async () => {
    mockTransaction.mockRejectedValue(new Error('Infrastructure failure'));

    const response = await updatePlayerAction({
      playerId,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.player).toBe(null);
  });
});
