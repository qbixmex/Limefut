const { mockFindFirst, mockUpdate, mockDeleteImage, mockGetSession } = vi.hoisted(() => ({
  mockFindFirst: vi.fn(),
  mockUpdate: vi.fn(),
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
        message: '¡ Debes estar autentificado para realizar esta acción !',
      };
    }

    if (!session.user.roles?.includes('admin')) {
      return {
        ok: false,
        message: '¡ No tienes permisos administrativos para realizar esta acción !',
      };
    }

    return { ok: true, session };
  },
}));

vi.mock('@/lib/prisma', () => ({
  default: {
    coach: {
      findFirst: mockFindFirst,
      update: mockUpdate,
    },
  },
}));

vi.mock('@/shared/actions/deleteImageAction', () => ({
  default: mockDeleteImage,
}));

import { deleteCoachImageAction } from '@/app/admin/entrenadores/(actions)/delete-coach-image.action';

const coachId = 'c93a8c24-ca76-493c-b1e3-f533454bbdae';

const mockCoachNoImage = {
  name: 'Roberto Sánchez',
  imagePublicID: null,
};

const imagePublicIdTest = '849d700fd47a';

const mockCoachWithImage = {
  name: 'Roberto Sánchez',
  imagePublicID: imagePublicIdTest,
};

describe('Tests on deleteCoachImageAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: 'user-1', roles: ['admin'] },
    });
    mockFindFirst.mockResolvedValue(mockCoachNoImage);
    mockUpdate.mockResolvedValue({ id: coachId });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await deleteCoachImageAction(coachId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/debes estar autentificado/i);
    expect(mockFindFirst).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: '1483aa3c-9daa-42ae-8cf0-1b59316d4a36',
        roles: ['user'],
      },
    });

    const response = await deleteCoachImageAction(coachId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockFindFirst).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: 'a56010cb-4038-437c-b544-46b134e3f84a',
        roles: null,
      },
    });

    const response = await deleteCoachImageAction(coachId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockFindFirst).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when authenticated user roles is empty', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: 'cf4e9d29-108f-4217-8399-2a18c243e4de',
        roles: [],
      },
    });

    const response = await deleteCoachImageAction(coachId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/permisos administrativos/i);
    expect(mockFindFirst).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should return error when coach does not exist', async () => {
    mockFindFirst.mockResolvedValue(null);

    const response = await deleteCoachImageAction(coachId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no existe/i);
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { id: coachId },
      select: {
        name: true,
        imagePublicID: true,
      },
    });
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should delete coach image from database, setting values to null', async () => {
    const response = await deleteCoachImageAction(coachId);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/eliminada/i);

    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { id: coachId },
      select: {
        name: true,
        imagePublicID: true,
      },
    });
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: coachId },
      data: {
        imageUrl: null,
        imagePublicID: null,
      },
    });
    expect(mockDeleteImage).not.toHaveBeenCalled();
  });

  test('Should delete coach image with cloudinary image', async () => {
    mockFindFirst.mockResolvedValue(mockCoachWithImage);
    mockDeleteImage.mockResolvedValue({ ok: true });

    const response = await deleteCoachImageAction(coachId);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/eliminada/i);
    expect(mockDeleteImage).toHaveBeenCalledWith(imagePublicIdTest);
  });

  test('Should throw when cloudinary image deletion fails', async () => {
    mockFindFirst.mockResolvedValue(mockCoachWithImage);
    mockDeleteImage.mockResolvedValue({ ok: false });

    const response = await deleteCoachImageAction(coachId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/cloudinary/i);
    expect(mockDeleteImage).toHaveBeenCalledWith(imagePublicIdTest);
  });

  test('Should propagate error when findFirst fails', async () => {
    mockFindFirst.mockRejectedValue(new Error('DB connection failed'));

    await expect(deleteCoachImageAction(coachId)).rejects.toThrow('DB connection failed');
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  test('Should propagate error when update fails', async () => {
    mockUpdate.mockRejectedValue(new Error('Database connection lost'));

    await expect(deleteCoachImageAction(coachId)).rejects.toThrow('Database connection lost');
  });
});
