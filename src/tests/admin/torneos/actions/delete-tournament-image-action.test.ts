const {
  MockPrismaClientKnownRequestError,
  mockFindFirst,
  mockUpdate,
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
    mockUpdate: vi.fn(),
    mockDeleteImage: vi.fn(),
  };
});

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    tournament: {
      findFirst: mockFindFirst,
      update: mockUpdate,
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

import { deleteTournamentImageAction } from '@/app/admin/torneos/(actions)';

const mockTournament = {
  name: 'Torneo de Prueba',
  imagePublicID: null,
};

describe('Tests on delete tournament image server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockFindFirst.mockResolvedValue(mockTournament);
    mockUpdate.mockResolvedValue({});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when authenticatedUserId is undefined', async () => {
    const response = await deleteTournamentImageAction({
      tournamentId: '6967dfb9-fd85-4247-9f13-c3654866d1ef',
      authenticatedUserId: undefined,
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('autentificado');
    expect(mockFindFirst).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    const response = await deleteTournamentImageAction({
      tournamentId: '4b578010-cfc3-4a02-9b1b-95d182bbeefe',
      authenticatedUserId: 'f8904d40-deee-46ed-b790-d9ce3e9df7b3',
      authenticatedUserRoles: ['user'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('permisos administrativos');
    expect(mockFindFirst).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when userRoles is null', async () => {
    const response = await deleteTournamentImageAction({
      tournamentId: '779d00f9-00fc-43eb-9769-5916960b32d7',
      authenticatedUserId: 'ade5b9b6-4ddd-4dbd-aea5-91670c9ae9b0',
      authenticatedUserRoles: null,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('permisos administrativos');
    expect(mockFindFirst).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when userRoles are empty', async () => {
    const response = await deleteTournamentImageAction({
      tournamentId: '348487a8-cc84-4dad-8a95-c99d90d14b55',
      authenticatedUserId: 'cb601b21-e3a4-48be-bf21-6c012683e3c5',
      authenticatedUserRoles: [],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('permisos administrativos');
    expect(mockFindFirst).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when tournament does not exist', async () => {
    mockFindFirst.mockResolvedValue(null);

    const response = await deleteTournamentImageAction({
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
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should delete image from cloudinary when imagePublicID exists', async () => {
    mockFindFirst.mockResolvedValue({
      name: 'Tournament with image',
      imagePublicID: 'cloudinary-id-123',
    });
    mockDeleteImage.mockResolvedValue({ ok: true });

    const response = await deleteTournamentImageAction({
      tournamentId: '87584100-2e05-46f0-8330-0c26c5ef9862',
      authenticatedUserId: '630ecfb4-5ac9-4e8a-ad93-e877304a018a',
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(true);
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: '87584100-2e05-46f0-8330-0c26c5ef9862' },
      data: { imageUrl: null, imagePublicID: null },
    });
    expect(mockDeleteImage).toHaveBeenCalledWith('cloudinary-id-123');
  });

  test('Should throw error when cloudinary image deletion fails', async () => {
    mockFindFirst.mockResolvedValue({
      name: 'Tournament with image',
      imagePublicID: 'cloudinary-id-456',
    });
    mockDeleteImage.mockResolvedValue({ ok: false });

    await expect(
      deleteTournamentImageAction({
        tournamentId: 'b08bbbc1-0191-4561-932f-eaeef6a6b4ba',
        authenticatedUserId: 'd108872a-3ed5-4ff9-b3f8-a28b859c443b',
        authenticatedUserRoles: ['user', 'admin'],
      }),
    ).rejects.toThrow('cloudinary');
    expect(mockDeleteImage).toHaveBeenCalledWith('cloudinary-id-456');
  });

  test('Should return error on prisma known error', async () => {
    mockUpdate.mockRejectedValue(
      new MockPrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        meta: { target: ['name'] },
      }),
    );

    const response = await deleteTournamentImageAction({
      tournamentId: '0f708860-84e3-4a6a-8a18-6f6f5171a443',
      authenticatedUserId: 'ae1dd592-3165-44a9-a819-8c41b8df519c',
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Unique constraint');
  });

  test('Should return error on generic error', async () => {
    mockUpdate.mockRejectedValue(new Error('Database connection lost'));

    const response = await deleteTournamentImageAction({
      tournamentId: '17726cb8-c31b-49d4-adcc-0ae9b80877f8',
      authenticatedUserId: '24f5797d-686b-4a2b-be51-7725fe80c16a',
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('logs del servidor');
  });
});
