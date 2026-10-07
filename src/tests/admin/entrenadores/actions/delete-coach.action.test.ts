const { mockFindUnique, mockDelete, mockDeleteImage, mockGetSession } = vi.hoisted(() => ({
  mockFindUnique: vi.fn(),
  mockDelete: vi.fn(),
  mockDeleteImage: vi.fn(),
  mockGetSession: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('next/headers', () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}));

vi.mock('@/lib/get-session', () => ({
  getSession: mockGetSession,
  requireAdmin: async () => {
    const session = await mockGetSession();

    if (!session?.user) {
      return {
        ok: false,
        message: 'Debes estar autentificado para realizar esta acción',
      };
    }

    if (!session.user.roles?.includes('admin')) {
      return {
        ok: false,
        message: 'No tienes permisos administrativos para realizar esta acción',
      };
    }

    return { ok: true, session };
  },
}));

vi.mock('@/lib/prisma', () => ({
  default: {
    coach: {
      findUnique: mockFindUnique,
      delete: mockDelete,
    },
  },
}));

vi.mock('@/shared/actions/deleteImageAction', () => ({
  default: mockDeleteImage,
}));

import { deleteCoachAction } from '@/app/admin/entrenadores/(actions)/delete-coach.action';

const coachId = 'c93a8c24-ca76-493c-b1e3-f533454bbdae';

const mockCoachNoImage = {
  name: 'Roberto Sánchez',
  imagePublicID: null,
};

const cloudinaryTestId = 'b4ed86727a82';

const mockCoachWithImage = {
  name: 'Roberto Sánchez',
  imagePublicID: cloudinaryTestId,
};

describe('Tests on deleteCoachAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['admin'] },
    });
    mockFindUnique.mockResolvedValue(mockCoachNoImage);
    mockDelete.mockResolvedValue({ id: coachId });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await deleteCoachAction(coachId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/debes estar autentificado/i);
    expect(mockFindUnique).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: '19eeeda9-0d45-4467-928a-8f02fcd6d478',
        roles: ['user'],
      },
    });

    const response = await deleteCoachAction(coachId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockFindUnique).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: '65b301d8-cb04-4690-8c04-e4648c2b7f62',
        roles: null,
      },
    });

    const response = await deleteCoachAction(coachId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockFindUnique).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is empty', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: '7f4d1ff7-972c-4dd5-a398-ce48f23caef2',
        roles: [],
      },
    });

    const response = await deleteCoachAction(coachId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockFindUnique).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when coach does not exist', async () => {
    mockFindUnique.mockResolvedValue(null);

    const response = await deleteCoachAction(coachId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no existe/i);
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: coachId },
      select: {
        name: true,
        imagePublicID: true,
      },
    });
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should delete a coach without image', async () => {
    const response = await deleteCoachAction(coachId);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/eliminado correctamente/i);

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { id: coachId },
      select: {
        imagePublicID: true,
        name: true,
      },
    });
    expect(mockDelete).toHaveBeenCalledWith({
      where: { id: coachId },
    });
    expect(mockDeleteImage).not.toHaveBeenCalled();
  });

  test('Should delete a coach with image and delete it from cloudinary', async () => {
    mockFindUnique.mockResolvedValue(mockCoachWithImage);
    mockDeleteImage.mockResolvedValue({ ok: true });

    const response = await deleteCoachAction(coachId);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/eliminado correctamente/i);
    expect(mockDeleteImage).toHaveBeenCalledWith(cloudinaryTestId);
  });

  test('Should throw when cloudinary image deletion fails', async () => {
    mockFindUnique.mockResolvedValue(mockCoachWithImage);
    mockDeleteImage.mockResolvedValue({ ok: false });

    await expect(deleteCoachAction(coachId)).rejects.toThrow('cloudinary');
    expect(mockDeleteImage).toHaveBeenCalledWith(cloudinaryTestId);
  });

  test('Should propagate error when findUnique fails', async () => {
    mockFindUnique.mockRejectedValue(new Error('DB connection failed'));

    await expect(deleteCoachAction(coachId))
      .rejects
      .toThrow('DB connection failed');
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should propagate error when delete fails', async () => {
    mockDelete.mockRejectedValue(new Error('Database connection lost'));

    await expect(deleteCoachAction(coachId))
      .rejects
      .toThrow('Database connection lost');
  });
});
