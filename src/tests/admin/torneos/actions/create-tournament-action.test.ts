const {
  MockPrismaClientKnownRequestError,
  mockTransaction,
  mockUploadImage,
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
}));

vi.mock('@/generated/prisma/client', () => ({
  Prisma: {
    PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
  },
}));

import { createTournamentAction } from '@/app/admin/torneos/(actions)';

const validFormData = (): FormData => {
  const formData = new FormData();
  formData.append('name', 'Tournament Test');
  formData.append('permalink', 'tournament-test');
  formData.append('country', 'México');
  formData.append('cities', JSON.stringify(['Guadalajara', 'Zapopan', 'Tonalá', 'Tlaquepaque']));
  formData.append('description', 'Irure dolore adipisicing exercitation nulla magna ad culpa.');
  formData.append('season', '2026-ending');
  formData.append('startDate', '2026-09-01T00:00:00.000Z');
  formData.append('endDate', '2026-12-22T00:00:00.000Z');
  formData.append('active', 'true');
  return formData;
};

const mockCreatedTournament = {
  id: '8b3cf2a1-7d4e-4f8c-9b0a-2e5f1c3d7a9b',
  name: 'Tournament Test',
  permalink: 'tournament-test',
  imageUrl: null,
  imagePublicID: null,
  description: 'Irure dolore adipisicing exercitation nulla magna ad culpa.',
  country: 'México',
  cities: ['Guadalajara', 'Zapopan', 'Tonalá', 'Tlaquepaque'],
  season: '2026-ending',
  startDate: new Date('2026-09-01T00:00:00.000Z'),
  endDate: new Date('2026-12-22T00:00:00.000Z'),
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockTx = {
  tournament: { create: vi.fn() },
  tournamentCategory: { createMany: vi.fn() },
};

describe('Tests on create tournament server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['admin'] },
    });
    mockTx.tournament.create.mockResolvedValue(mockCreatedTournament);
    mockTx.tournamentCategory.createMany.mockResolvedValue({ count: 2 });
    mockTransaction.mockImplementation(
      (cb: (tx: typeof mockTx) => unknown) => cb(mockTx),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when there is no authenticated session', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await createTournamentAction({
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ Debes estar autentificado para realizar esta acción !');
    expect(response.tournament).toBeNull();
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'ecc10b39-fb57-49d6-856b-31c4098be95a', roles: ['user'] },
    });

    const response = await createTournamentAction({
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(response.tournament).toBeNull();
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should not allow to create a tournament if roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'ecc10b39-fb57-49d6-856b-31c4098be95a', roles: null },
    });

    const response = await createTournamentAction({
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(response.tournament).toBeNull();
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should not allow to create a tournament if roles are empty', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: '19fafe1d-6847-450c-a5a7-80f61c80ed4f', roles: [] },
    });

    const response = await createTournamentAction({
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(response.tournament).toBeNull();
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when zod validation fails', async () => {
    const formData = validFormData();
    formData.set('name', 'ab');

    const response = await createTournamentAction({
      formData,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('nombre');
    expect(response.tournament).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should throw when image upload fails', async () => {
    mockUploadImage.mockResolvedValue(null);

    const formData = validFormData();
    const imageFile = new File([''], 'test.png', { type: 'image/png' });
    formData.append('image', imageFile);

    await expect(
      createTournamentAction({
        formData,
      }),
    ).rejects.toThrow('cloudinary');
  });

  test('Should create a tournament without image', async () => {
    const response = await createTournamentAction({
      formData: validFormData(),
    });

    expect(response.ok).toBe(true);
    expect(response.message).toContain('creado satisfactoriamente');
    expect(response.tournament).not.toBe(null);
    expect(response.tournament?.id).toBe(mockCreatedTournament.id);
    expect(response.tournament?.name).toBe(mockCreatedTournament.name);
    expect(response.tournament?.imageUrl).toBeNull();
    expect(response.tournament?.imagePublicID).toBeNull();

    expect(mockTransaction).toHaveBeenCalled();
    expect(mockTx.tournament.create).toHaveBeenCalledOnce();
    expect(mockTx.tournamentCategory.createMany).not.toHaveBeenCalled();
  });

  test('Should create a tournament with image', async () => {
    mockUploadImage.mockResolvedValue({
      secureUrl: 'https://res.cloudinary.com/test/image.jpg',
      publicId: 'test-public-id',
    });

    const formData = validFormData();
    const imageFile = new File([''], 'test.png', { type: 'image/png' });
    formData.append('image', imageFile);

    const response = await createTournamentAction({
      formData,
    });

    expect(response.ok).toBe(true);
    expect(response.message).toContain('creado satisfactoriamente');

    expect(mockUploadImage).toHaveBeenCalledWith(imageFile, 'tournaments');
    expect(mockTransaction).toHaveBeenCalled();

    expect(mockTx.tournament.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          imageUrl: 'https://res.cloudinary.com/test/image.jpg',
          imagePublicID: 'test-public-id',
        }),
      }),
    );
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockTransaction.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: { target: ['name', 'permalink'] },
      }),
    );

    const response = await createTournamentAction({
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('campos duplicados');
    expect(response.tournament).toBe(null);
  });

  test('Should return error on prisma known error', async () => {
    mockTransaction.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
      }),
    );

    const response = await createTournamentAction({
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Error al crear el torneo');
    expect(response.tournament).toBe(null);
  });

  test('Should return error on unexpected error', async () => {
    mockTransaction.mockRejectedValue(new Error('Something went wrong'));

    const response = await createTournamentAction({
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Error inesperado');
    expect(response.tournament).toBeNull();
  });
});
