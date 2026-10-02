const { mockFindFirst, mockDelete, mockGetSession } = vi.hoisted(() => ({
  mockFindFirst: vi.fn(),
  mockDelete: vi.fn(),
  mockGetSession: vi.fn(),
}));

vi.mock('next/cache');

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
    playoff: {
      findFirst: mockFindFirst,
      delete: mockDelete,
    },
  },
}));

import { deletePlayoffAction } from '@/app/admin/liguilla/(actions)/delete-playoff.action';

const playoffId = '376ec9ed-fd25-4d92-ad26-35b7a354eab1';

describe('Tests on deletePlayoffAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: 'b7e2ca32-af95-4750-bf63-6a338b236097', roles: ['admin'] },
    });
    mockFindFirst.mockResolvedValue({
      id: playoffId,
      _count: { matches: 0 },
    });
    mockDelete.mockResolvedValue({ id: playoffId });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await deletePlayoffAction(playoffId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(mockFindFirst).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: {
          id: 'c45414c0-044b-4319-acbb-45584a0839fa',
          roles: ['user'],
        },
    });

    const response = await deletePlayoffAction(playoffId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when roles is null', async () => {
    mockGetSession.mockResolvedValue({
      user: {
          id: '9fb64c9c-f5d9-4391-95e1-1a11f9edfeef',
          roles: null,
        },
    });

    const response = await deletePlayoffAction(playoffId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when roles are empty', async () => {
    mockGetSession.mockResolvedValue({
      user: {
        id: 'c8ad7f64-4d9f-4f17-b73d-964894b3bf29',
        roles: [],
      },
    });

    const response = await deletePlayoffAction(playoffId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when playoff does not exist', async () => {
    mockFindFirst.mockResolvedValue(null);

    const response = await deletePlayoffAction(playoffId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no se puede eliminar la liguilla/i);
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { id: playoffId },
      select: {
        id: true,
        _count: {
          select: { matches: true },
        },
      },
    });
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when playoff contains matches', async () => {
    mockFindFirst.mockResolvedValue({
      id: playoffId,
      _count: { matches: 2 },
    });

    const response = await deletePlayoffAction(playoffId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/contiene encuentros/i);
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should delete a playoff successfully', async () => {
    const response = await deletePlayoffAction(playoffId);

    expect(mockDelete).toHaveBeenCalledWith({ where: { id: playoffId } });
    expect(response.ok).toBe(true);
    expect(response.message).toBe('La liguilla ha sido eliminada correctamente');
  });

  test('Should return error when delete throws an Error', async () => {
    mockDelete.mockRejectedValue(new Error('DB connection failed'));

    const response = await deletePlayoffAction(playoffId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No se pudo eliminar la liguilla');
  });

  test('Should return error on unknown error', async () => {
    mockDelete.mockRejectedValue('Something unexpected');

    const response = await deletePlayoffAction(playoffId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Error inesperado del sistema, revise los logs');
  });
});
