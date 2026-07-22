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
    mockTx.tournament.count.mockResolvedValue(1);
    mockTx.tournament.update.mockResolvedValue(mockUpdatedTournament);
    mockTransaction.mockImplementation(
      (cb: (tx: typeof mockTx) => unknown) => cb(mockTx),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when authenticatedUserId is undefined', async () => {
    const response = await updateTournamentAction({
      tournamentId: '5adcfd78-b364-4139-9169-9b5be135c535',
      authenticatedUserId: undefined,
      authenticatedUserRoles: ['user', 'admin'],
      formData: editFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('autentificado');
    expect(response.tournament).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    const response = await updateTournamentAction({
      tournamentId: '37ff7337-e472-424e-9cda-b791ca1a1bee',
      authenticatedUserId: '77f3bdd6-e54b-4508-8e4d-3b4cb41e7736',
      authenticatedUserRoles: ['user'],
      formData: editFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('permisos administrativos');
    expect(response.tournament).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should not allow update if roles is null', async () => {
    const response = await updateTournamentAction({
      tournamentId: 'f6024c4b-687d-4e76-9299-d9342207a7f9',
      authenticatedUserId: 'e0ec1ba2-b716-4461-9580-c0f17ac0763b',
      authenticatedUserRoles: null,
      formData: editFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('permisos administrativos');
    expect(response.tournament).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should not allow update if roles are empty', async () => {
    const response = await updateTournamentAction({
      tournamentId: 'b48f2791-1a67-4a63-87be-f59b5263188c',
      authenticatedUserId: 'd108872a-3ed5-4ff9-b3f8-a28b859c443b',
      authenticatedUserRoles: [],
      formData: editFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('permisos administrativos');
    expect(response.tournament).toBe(null);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  test('Should return error when zod validation fails', async () => {
    const formData = editFormData();
    formData.set('permalink', 'invalid permalink with spaces');

    const response = await updateTournamentAction({
      tournamentId: '17726cb8-c31b-49d4-adcc-0ae9b80877f8',
      authenticatedUserId: 'd362ba04-ff0b-46a7-ba36-13dd42bfc4c9',
      authenticatedUserRoles: ['user', 'admin'],
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
        authenticatedUserId: 'a452830b-d97e-4100-b4ae-3da6bb3b758c',
        authenticatedUserRoles: ['user', 'admin'],
        formData,
      }),
    ).rejects.toThrow('cloudinary');
  });

  test('Should return error when tournament does not exist', async () => {
    mockTx.tournament.count.mockResolvedValue(0);

    const response = await updateTournamentAction({
      tournamentId: '0f708860-84e3-4a6a-8a18-6f6f5171a443',
      authenticatedUserId: 'ae1dd592-3165-44a9-a819-8c41b8df519c',
      authenticatedUserRoles: ['user', 'admin'],
      formData: editFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('no existe');
    expect(response.tournament).toBe(null);
  });

  test('Should update a tournament without image and without categories', async () => {
    const response = await updateTournamentAction({
      tournamentId: '8b3cf2a1-7d4e-4f8c-9b0a-2e5f1c3d7a9b',
      authenticatedUserId: '38cef513-9bd0-464b-b0dc-b1b758f77cab',
      authenticatedUserRoles: ['user', 'admin'],
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
      authenticatedUserId: '2fe9799d-9e6e-421d-99e8-2fd9ff85c47e',
      authenticatedUserRoles: ['user', 'admin'],
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
      authenticatedUserId: '9ee2912d-84fb-4e08-b753-27cb903bcf0b',
      authenticatedUserRoles: ['user', 'admin'],
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
      authenticatedUserId: '9af45d3b-613f-4f18-b6eb-9c121e25a765',
      authenticatedUserRoles: ['user', 'admin'],
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
      authenticatedUserId: '24f5797d-686b-4a2b-be51-7725fe80c16a',
      authenticatedUserRoles: ['user', 'admin'],
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
      authenticatedUserId: '785b4b4d-1060-4cd9-a698-1aa0dcbdde44',
      authenticatedUserRoles: ['user', 'admin'],
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
      authenticatedUserId: '630ecfb4-5ac9-4e8a-ad93-e877304a018a',
      authenticatedUserRoles: ['user', 'admin'],
      formData: editFormData(),
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Error inesperado');
    expect(response.tournament).toBe(null);
  });
});
