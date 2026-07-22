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
    mockTx.tournament.create.mockResolvedValue(mockCreatedTournament);
    mockTx.tournamentCategory.createMany.mockResolvedValue({ count: 2 });
    mockTransaction.mockImplementation(
      (cb: (tx: typeof mockTx) => unknown) => cb(mockTx),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when authenticatedUserId is undefined', async () => {
    const response = await createTournamentAction({
      authenticatedUserId: undefined,
      authenticatedUserRoles: ['admin'],
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('autenticado');
    expect(response.tournament).toBeNull();
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    const response = await createTournamentAction({
      authenticatedUserId: 'ecc10b39-fb57-49d6-856b-31c4098be95a',
      authenticatedUserRoles: ['user'],
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('permisos administrativos');
    expect(response.tournament).toBeNull();
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should not allow to create a tournament if roles is null', async () => {
    const response = await createTournamentAction({
      authenticatedUserId: 'ecc10b39-fb57-49d6-856b-31c4098be95a',
      authenticatedUserRoles: null,
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('permisos administrativos');
    expect(response.tournament).toBeNull();
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should not allow to create a tournament if roles are empty', async () => {
    const response = await createTournamentAction({
      authenticatedUserId: '19fafe1d-6847-450c-a5a7-80f61c80ed4f',
      authenticatedUserRoles: [],
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('permisos administrativos');
    expect(response.tournament).toBeNull();
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when zod validation fails', async () => {
    const formData = validFormData();
    formData.set('name', 'ab');

    const response = await createTournamentAction({
      authenticatedUserId: '7ab083c7-9389-4842-8735-1dd283eaf3c4',
      authenticatedUserRoles: ['user', 'admin'],
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
        authenticatedUserId: 'fb5b126d-31fd-477a-b190-09c5d266be69',
        authenticatedUserRoles: ['admin'],
        formData,
      }),
    ).rejects.toThrow('cloudinary');
  });

  test('Should create a tournament without image', async () => {
    const response = await createTournamentAction({
      authenticatedUserId: 'dbcf3107-c2bb-4f9f-ba4d-152ac918d93c',
      authenticatedUserRoles: ['user', 'admin'],
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
      authenticatedUserId: '9e16e6ff-d20b-408c-b316-7d3edaeb66f9',
      authenticatedUserRoles: ['user', 'admin'],
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
      authenticatedUserId: '987df461-89c3-4050-bf44-4d4dc4a3e9a1',
      authenticatedUserRoles: ['user', 'admin'],
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
      authenticatedUserId: 'fdbd8d2f-ece3-4cb7-9417-b3e4b4086399',
      authenticatedUserRoles: ['user', 'admin'],
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Error al crear el torneo');
    expect(response.tournament).toBe(null);
  });

  test('Should return error on unexpected error', async () => {
    mockTransaction.mockRejectedValue(new Error('Something went wrong'));

    const response = await createTournamentAction({
      authenticatedUserId: '14b74b98-bba8-4798-be65-a002fb1912d9',
      authenticatedUserRoles: ['user', 'admin'],
      formData: validFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Error inesperado');
    expect(response.tournament).toBeNull();
  });
});
