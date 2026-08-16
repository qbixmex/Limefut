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

import { updateTournamentAction } from '@/app/admin/torneos/(actions)';

const editFormData = (): FormData => {
  const formData = new FormData();
  formData.append('name', 'Torneo Actualizado');
  formData.append('permalink', 'torneo-actualizado');
  formData.append('description', 'Descripcion actualizada');
  formData.append('season', '2026-ending');
  formData.append('startDate', '2026-09-01T00:00:00.000Z');
  formData.append('endDate', '2026-12-22T00:00:00.000Z');
  formData.append('active', 'true');
  return formData;
};

const mockUpdatedTournament = {
  id: '8b3cf2a1-7d4e-4f8c-9b0a-2e5f1c3d7a9b',
  name: 'Torneo Actualizado',
  permalink: 'torneo-actualizado',
  imageUrl: null,
  imagePublicID: null,
  description: 'Descripcion actualizada',
  country: null,
  cities: [],
  season: '2026-ending',
  startDate: new Date('2026-09-01T00:00:00.000Z'),
  endDate: new Date('2026-12-22T00:00:00.000Z'),
  active: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockTx = {
  tournament: {
    count: vi.fn(),
    update: vi.fn(),
  },
  tournamentCategory: {
    deleteMany: vi.fn(),
    createMany: vi.fn(),
  },
};

describe('Tests on update tournament server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['admin'] },
    });
    mockTx.tournament.count.mockResolvedValue(1);
    mockTx.tournament.update.mockResolvedValue(mockUpdatedTournament);
    mockTransaction.mockImplementation(
      (cb: (tx: typeof mockTx) => unknown) => cb(mockTx),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when there is no authenticated session', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await updateTournamentAction({
      tournamentId: '5adcfd78-b364-4139-9169-9b5be135c535',
      formData: editFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ Debes estar autentificado para realizar esta acción !');
    expect(response.tournament).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: '77f3bdd6-e54b-4508-8e4d-3b4cb41e7736', roles: ['user'] },
    });

    const response = await updateTournamentAction({
      tournamentId: '37ff7337-e472-424e-9cda-b791ca1a1bee',
      formData: editFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(response.tournament).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should not allow update if roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'e0ec1ba2-b716-4461-9580-c0f17ac0763b', roles: null },
    });

    const response = await updateTournamentAction({
      tournamentId: 'f6024c4b-687d-4e76-9299-d9342207a7f9',
      formData: editFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(response.tournament).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should not allow update if roles are empty', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'd108872a-3ed5-4ff9-b3f8-a28b859c443b', roles: [] },
    });

    const response = await updateTournamentAction({
      tournamentId: 'b48f2791-1a67-4a63-87be-f59b5263188c',
      formData: editFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(response.tournament).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when zod validation fails', async () => {
    const formData = editFormData();
    formData.set('permalink', 'invalid permalink with spaces');

    const response = await updateTournamentAction({
      tournamentId: '17726cb8-c31b-49d4-adcc-0ae9b80877f8',
      formData,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('espacios');
    expect(response.tournament).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should throw when image upload fails before transaction', async () => {
    mockUploadImage.mockResolvedValue(null);

    const formData = editFormData();
    const imageFile = new File([''], 'tournament-image.png', { type: 'image/png' });
    formData.append('image', imageFile);

    await expect(
      updateTournamentAction({
        tournamentId: '05cb46ed-94d5-407a-b0ab-6181f41fc007',
        formData,
      }),
    ).rejects.toThrow('cloudinary');
  });

  test('Should return error when tournament does not exist', async () => {
    mockTx.tournament.count.mockResolvedValue(0);

    const response = await updateTournamentAction({
      tournamentId: '0f708860-84e3-4a6a-8a18-6f6f5171a443',
      formData: editFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('no existe');
    expect(response.tournament).toBe(null);
  });

  test('Should update a tournament without image and without categories', async () => {
    const response = await updateTournamentAction({
      tournamentId: '8b3cf2a1-7d4e-4f8c-9b0a-2e5f1c3d7a9b',
      formData: editFormData(),
    });

    expect(response.ok).toBe(true);
    expect(response.message).toContain('actualizado correctamente');
    expect(response.tournament).not.toBe(null);
    expect(response.tournament?.name).toBe(mockUpdatedTournament.name);

    expect(mockTransaction).toHaveBeenCalled();
    expect(mockTx.tournament.count).toHaveBeenCalledWith({
      where: { id: '8b3cf2a1-7d4e-4f8c-9b0a-2e5f1c3d7a9b' },
    });
    expect(mockTx.tournament.update).toHaveBeenCalledTimes(1);
    expect(mockTx.tournamentCategory.deleteMany).not.toHaveBeenCalled();
    expect(mockTx.tournamentCategory.createMany).not.toHaveBeenCalled();
  });

  test('Should update a tournament with image replacement', async () => {
    mockTx.tournament.update.mockResolvedValue({
      ...mockUpdatedTournament,
      imageUrl: 'https://res.cloudinary.com/old/image.jpg',
      imagePublicID: '1668ec04ad2f',
    });
    mockDeleteImage.mockResolvedValue({ ok: true });
    mockUploadImage.mockResolvedValue({
      secureUrl: 'https://res.cloudinary.com/new/image.jpg',
      publicId: 'new-public-id',
    });

    const formData = editFormData();
    const imageFile = new File([''], 'test.skip.png', { type: 'image/png' });
    formData.append('image', imageFile);

    const response = await updateTournamentAction({
      tournamentId: '8b3cf2a1-7d4e-4f8c-9b0a-2e5f1c3d7a9b',
      formData,
    });

    expect(response.ok).toBe(true);
    expect(response.message).toContain('actualizado correctamente');
    expect(mockDeleteImage).toHaveBeenCalledWith('1668ec04ad2f');
    expect(mockUploadImage).toHaveBeenCalledWith(imageFile, 'tournaments');
    expect(mockTx.tournament.update).toHaveBeenCalledTimes(2);
  });

  test('Should update a tournament with categoriesIds', async () => {
    const formData = editFormData();
    formData.append(
      'categoriesIds',
      JSON.stringify([
        '5f42886e-ba04-43c8-80ca-943521838880',
        '657f11d1-59d0-494f-bc4e-6021f2d7040a',
      ]),
    );

    const response = await updateTournamentAction({
      tournamentId: '8b3cf2a1-7d4e-4f8c-9b0a-2e5f1c3d7a9b',
      formData,
    });

    expect(response.ok).toBe(true);
    expect(mockTx.tournamentCategory.deleteMany).toHaveBeenCalledWith({
      where: { tournamentId: '8b3cf2a1-7d4e-4f8c-9b0a-2e5f1c3d7a9b' },
    });
    expect(mockTx.tournamentCategory.createMany).toHaveBeenCalledWith({
      data: [
        {
          tournamentId: '8b3cf2a1-7d4e-4f8c-9b0a-2e5f1c3d7a9b',
          categoryId: '5f42886e-ba04-43c8-80ca-943521838880',
        },
        {
          tournamentId: '8b3cf2a1-7d4e-4f8c-9b0a-2e5f1c3d7a9b',
          categoryId: '657f11d1-59d0-494f-bc4e-6021f2d7040a',
        },
      ],
    });
  });

  test('Should return error on duplicate fields (P2002)', async () => {
    mockTx.tournament.count.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: { target: ['name', 'permalink'] },
      }),
    );

    const response = await updateTournamentAction({
      tournamentId: '87584100-2e05-46f0-8330-0c26c5ef9862',
      formData: editFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('campos duplicados');
    expect(response.tournament).toBe(null);
  });

  test('Should return error on prisma known error', async () => {
    mockTx.tournament.count.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Foreign key constraint failed', {
        code: 'P2003',
      }),
    );

    const response = await updateTournamentAction({
      tournamentId: 'b63c4c3c-2fe5-4062-aeda-6d7ccff90b39',
      formData: editFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Error al actualizar el torneo');
    expect(response.tournament).toBe(null);
  });

  test('Should return error on unexpected error', async () => {
    mockTx.tournament.count.mockRejectedValue(new Error('Something went wrong'));

    const response = await updateTournamentAction({
      tournamentId: '5b30cfcb-54c0-4025-99dc-8390bed42c5b',
      formData: editFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Error inesperado');
    expect(response.tournament).toBe(null);
  });

  test('Should return error when transaction itself rejects', async () => {
    mockTransaction.mockRejectedValue(new Error('Infrastructure failure'));

    const response = await updateTournamentAction({
      tournamentId: 'b08bbbc1-0191-4561-932f-eaeef6a6b4ba',
      formData: editFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Error inesperado');
    expect(response.tournament).toBe(null);
  });
});
