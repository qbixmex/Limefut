const {
  MockPrismaClientKnownRequestError,
  mockFindFirst,
  mockDelete,
  mockTeamCount,
  mockPlayoffCount,
  mockStandingsCount,
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
    mockFindFirst: vi.fn(),
    mockDelete: vi.fn(),
    mockTeamCount: vi.fn(),
    mockPlayoffCount: vi.fn(),
    mockStandingsCount: vi.fn(),
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
    mockGetSession.mockResolvedValue({
      user: { id: '370d1853-7a01-4884-8474-3a628bcb6504', roles: ['admin'] },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when there is no authenticated session', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await deleteTournamentAction('eb29d6b5-baf2-4ce2-b29f-f243b11c6055');

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ Debes estar autentificado para realizar esta acción !');
    expect(mockFindFirst).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: '370d1853-7a01-4884-8474-3a628bcb6504', roles: ['user'] },
    });

    const response = await deleteTournamentAction('eb29d6b5-baf2-4ce2-b29f-f243b11c6055');

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(mockFindFirst).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when userRoles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: '8dc234cb-184b-40f1-8f0a-bbb8d5f90d93', roles: null },
    });

    const response = await deleteTournamentAction('eb29d6b5-baf2-4ce2-b29f-f243b11c6055');

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(mockFindFirst).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when userRoles are empty', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: '7a2a1e56-7361-4080-bd34-6feb580c57ba', roles: [] },
    });

    const response = await deleteTournamentAction('eb29d6b5-baf2-4ce2-b29f-f243b11c6055');

    expect(response.ok).toBe(false);
    expect(response.message).toBe('¡ No tienes permisos administrativos para realizar esta acción !');
    expect(mockFindFirst).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when tournament does not exist', async () => {
    mockFindFirst.mockResolvedValue(null);

    const response = await deleteTournamentAction('5adcfd78-b364-4139-9169-9b5be135c535');

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

    const response = await deleteTournamentAction('37ff7337-e472-424e-9cda-b791ca1a1bee');

    expect(response.ok).toBe(false);
    expect(response.message).toContain('equipos');
    expect(mockTeamCount).toHaveBeenCalledWith({
      where: { tournamentId: '37ff7337-e472-424e-9cda-b791ca1a1bee' },
    });
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when tournament contains playoffs', async () => {
    mockPlayoffCount.mockResolvedValue(2);

    const response = await deleteTournamentAction('f6024c4b-687d-4e76-9299-d9342207a7f9');

    expect(response.ok).toBe(false);
    expect(response.message).toContain('liguilla');
    expect(mockPlayoffCount).toHaveBeenCalledWith({
      where: { tournamentId: 'f6024c4b-687d-4e76-9299-d9342207a7f9' },
    });
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when tournament contains standings', async () => {
    mockStandingsCount.mockResolvedValue(5);

    const response = await deleteTournamentAction('b48f2791-1a67-4a63-87be-f59b5263188c');

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

    const response = await deleteTournamentAction('0f708860-84e3-4a6a-8a18-6f6f5171a443');

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Unique constraint');
    expect(mockDelete).toHaveBeenCalledWith({
      where: { id: '0f708860-84e3-4a6a-8a18-6f6f5171a443' },
    });
  });

  test('Should return error when prisma delete throws generic error', async () => {
    mockDelete.mockRejectedValue(new Error('Database connection lost'));

    const response = await deleteTournamentAction('17726cb8-c31b-49d4-adcc-0ae9b80877f8');

    expect(response.ok).toBe(false);
    expect(response.message).toContain('logs del servidor');
    expect(mockDelete).toHaveBeenCalledWith({
      where: { id: '17726cb8-c31b-49d4-adcc-0ae9b80877f8' },
    });
  });

  test('Should return error when prisma delete throws unknown error', async () => {
    mockDelete.mockRejectedValue('Some non-error object');

    const response = await deleteTournamentAction('05cb46ed-94d5-407a-b0ab-6181f41fc007');

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Error del servidor no esperado');
  });

  test('Should delete tournament without image', async () => {
    const response = await deleteTournamentAction('8b3cf2a1-7d4e-4f8c-9b0a-2e5f1c3d7a9b');

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

    const response = await deleteTournamentAction('87584100-2e05-46f0-8330-0c26c5ef9862');

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
      deleteTournamentAction('b08bbbc1-0191-4561-932f-eaeef6a6b4ba'),
    ).rejects.toThrow('cloudinary');
    expect(mockDeleteImage).toHaveBeenCalledWith('cloudinary-id-456');
  });
});
