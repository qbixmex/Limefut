const {
  MockPrismaClientKnownRequestError,
  mockFindFirst,
  mockDelete,
  mockTeamCount,
  mockPlayoffCount,
  mockStandingsCount,
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
    mockFindFirst: vi.fn(),
    mockDelete: vi.fn(),
    mockTeamCount: vi.fn(),
    mockPlayoffCount: vi.fn(),
    mockStandingsCount: vi.fn(),
    mockDeleteImage: vi.fn(),
  };
});

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    tournament: {
      findFirst: mockFindFirst,
      delete: mockDelete,
    },
    team: {
      count: mockTeamCount,
    },
    playoff: {
      count: mockPlayoffCount,
    },
    standings: {
      count: mockStandingsCount,
    },
  },
}));

vi.mock('@/shared/actions', () => ({
  deleteImage: mockDeleteImage,
}));

vi.mock('@/generated/prisma/client', () => ({
  Prisma: {
    PrismaClientKnownRequestError: MockPrismaClientKnownRequestError,
  },
}));

import { deleteTournamentAction } from '@/app/admin/torneos/(actions)';

const mockTournament = {
  name: 'Torneo de Prueba',
  imagePublicID: null,
};

describe('Tests on delete tournament server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockFindFirst.mockResolvedValue(mockTournament);
    mockTeamCount.mockResolvedValue(0);
    mockPlayoffCount.mockResolvedValue(0);
    mockStandingsCount.mockResolvedValue(0);
    mockDelete.mockResolvedValue({});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when authenticatedUserId is undefined', async () => {
    const response = await deleteTournamentAction({
      tournamentId: 'eb29d6b5-baf2-4ce2-b29f-f243b11c6055',
      authenticatedUserId: undefined,
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('autentificado');
    expect(mockFindFirst).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    const response = await deleteTournamentAction({
      tournamentId: 'eb29d6b5-baf2-4ce2-b29f-f243b11c6055',
      authenticatedUserId: '370d1853-7a01-4884-8474-3a628bcb6504',
      authenticatedUserRoles: ['user'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('permisos administrativos');
    expect(mockFindFirst).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when userRoles is null', async () => {
    const response = await deleteTournamentAction({
      tournamentId: 'eb29d6b5-baf2-4ce2-b29f-f243b11c6055',
      authenticatedUserId: '8dc234cb-184b-40f1-8f0a-bbb8d5f90d93',
      authenticatedUserRoles: null,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('permisos administrativos');
    expect(mockFindFirst).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when userRoles are empty', async () => {
    const response = await deleteTournamentAction({
      tournamentId: 'eb29d6b5-baf2-4ce2-b29f-f243b11c6055',
      authenticatedUserId: '7a2a1e56-7361-4080-bd34-6feb580c57ba',
      authenticatedUserRoles: [],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('permisos administrativos');
    expect(mockFindFirst).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when tournament does not exist', async () => {
    mockFindFirst.mockResolvedValue(null);

    const response = await deleteTournamentAction({
      tournamentId: '5adcfd78-b364-4139-9169-9b5be135c535',
      authenticatedUserId: '38cef513-9bd0-464b-b0dc-b1b758f77cab',
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('no existe');
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { id: '5adcfd78-b364-4139-9169-9b5be135c535' },
      select: { name: true, imagePublicID: true },
    });
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when tournament contains teams', async () => {
    mockTeamCount.mockResolvedValue(3);

    const response = await deleteTournamentAction({
      tournamentId: '37ff7337-e472-424e-9cda-b791ca1a1bee',
      authenticatedUserId: '9af45d3b-613f-4f18-b6eb-9c121e25a765',
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('equipos');
    expect(mockTeamCount).toHaveBeenCalledWith({
      where: { tournamentId: '37ff7337-e472-424e-9cda-b791ca1a1bee' },
    });
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when tournament contains playoffs', async () => {
    mockPlayoffCount.mockResolvedValue(2);

    const response = await deleteTournamentAction({
      tournamentId: 'f6024c4b-687d-4e76-9299-d9342207a7f9',
      authenticatedUserId: 'd362ba04-ff0b-46a7-ba36-13dd42bfc4c9',
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('liguilla');
    expect(mockPlayoffCount).toHaveBeenCalledWith({
      where: { tournamentId: 'f6024c4b-687d-4e76-9299-d9342207a7f9' },
    });
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when tournament contains standings', async () => {
    mockStandingsCount.mockResolvedValue(5);

    const response = await deleteTournamentAction({
      tournamentId: 'b48f2791-1a67-4a63-87be-f59b5263188c',
      authenticatedUserId: '785b4b4d-1060-4cd9-a698-1aa0dcbdde44',
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('estadísticas');
    expect(mockStandingsCount).toHaveBeenCalledWith({
      where: { tournamentId: 'b48f2791-1a67-4a63-87be-f59b5263188c' },
    });
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when prisma delete throws known error', async () => {
    mockDelete.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: { target: ['name'] },
      }),
    );

    const response = await deleteTournamentAction({
      tournamentId: '0f708860-84e3-4a6a-8a18-6f6f5171a443',
      authenticatedUserId: 'ae1dd592-3165-44a9-a819-8c41b8df519c',
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Unique constraint');
    expect(mockDelete).toHaveBeenCalledWith({
      where: { id: '0f708860-84e3-4a6a-8a18-6f6f5171a443' },
    });
  });

  test('Should return error when prisma delete throws generic error', async () => {
    mockDelete.mockRejectedValue(new Error('Database connection lost'));

    const response = await deleteTournamentAction({
      tournamentId: '17726cb8-c31b-49d4-adcc-0ae9b80877f8',
      authenticatedUserId: '24f5797d-686b-4a2b-be51-7725fe80c16a',
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('logs del servidor');
    expect(mockDelete).toHaveBeenCalledWith({
      where: { id: '17726cb8-c31b-49d4-adcc-0ae9b80877f8' },
    });
  });

  test('Should return error when prisma delete throws unknown error', async () => {
    mockDelete.mockRejectedValue('Some non-error object');

    const response = await deleteTournamentAction({
      tournamentId: '05cb46ed-94d5-407a-b0ab-6181f41fc007',
      authenticatedUserId: '9ee2912d-84fb-4e08-b753-27cb903bcf0b',
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Error del servidor no esperado');
  });

  test('Should delete tournament without image', async () => {
    const response = await deleteTournamentAction({
      tournamentId: '8b3cf2a1-7d4e-4f8c-9b0a-2e5f1c3d7a9b',
      authenticatedUserId: 'a452830b-d97e-4100-b4ae-3da6bb3b758c',
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(true);
    expect(response.message).toContain('Torneo de Prueba');
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { id: '8b3cf2a1-7d4e-4f8c-9b0a-2e5f1c3d7a9b' },
      select: { name: true, imagePublicID: true },
    });
    expect(mockDelete).toHaveBeenCalledWith({
      where: { id: '8b3cf2a1-7d4e-4f8c-9b0a-2e5f1c3d7a9b' },
    });
    expect(mockDeleteImage).not.toHaveBeenCalled();
  });

  test('Should delete tournament with image and delete from cloudinary', async () => {
    mockFindFirst.mockResolvedValue({
      name: 'Tournament with image',
      imagePublicID: '3a5c59e40ed4',
    });
    mockDeleteImage.mockResolvedValue({ ok: true });

    const response = await deleteTournamentAction({
      tournamentId: '87584100-2e05-46f0-8330-0c26c5ef9862',
      authenticatedUserId: '630ecfb4-5ac9-4e8a-ad93-e877304a018a',
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(true);
    expect(response.message).toContain('Tournament with image');
    expect(mockDeleteImage).toHaveBeenCalledWith('3a5c59e40ed4');
  });

  test('Should throw when cloudinary image deletion fails', async () => {
    mockFindFirst.mockResolvedValue({
      name: 'Torneo con Imagen',
      imagePublicID: 'cloudinary-id-456',
    });
    mockDeleteImage.mockResolvedValue({ ok: false });

    await expect(
      deleteTournamentAction({
        tournamentId: 'b08bbbc1-0191-4561-932f-eaeef6a6b4ba',
        authenticatedUserId: 'd108872a-3ed5-4ff9-b3f8-a28b859c443b',
        authenticatedUserRoles: ['user', 'admin'],
      }),
    ).rejects.toThrow('cloudinary');
    expect(mockDeleteImage).toHaveBeenCalledWith('cloudinary-id-456');
  });
});
