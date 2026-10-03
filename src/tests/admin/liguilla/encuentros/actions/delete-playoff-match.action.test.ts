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
    playoffMatch: {
      findFirst: mockFindFirst,
      delete: mockDelete,
    },
  },
}));

import { deletePlayoffMatchAction } from '@/app/admin/liguilla/[playoff_id]/encuentros/(actions)/delete-playoff-match.action';

const matchId = '6d7e8f9a-1b2c-4d3e-8f4a-5b6c7d8e9f0a';

describe('Tests on deletePlayoffMatchAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => { });
    mockGetSession.mockResolvedValue({
      user: { id: 'b7e2ca32-af95-4750-bf63-6a338b236097', roles: ['admin'] },
    });
    mockFindFirst.mockResolvedValue({ id: matchId });
    mockDelete.mockResolvedValue({ id: matchId });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return error when user is not authenticated', async () => {
    mockGetSession.mockResolvedValue(null);

    const response = await deletePlayoffMatchAction(matchId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('Debes estar autentificado para realizar esta acción');
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    mockGetSession.mockResolvedValue({
      user: { id: 'c45414c0-044b-4319-acbb-45584a0839fa', roles: ['user'] },
    });

    const response = await deletePlayoffMatchAction(matchId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should return error when the match does not exist', async () => {
    mockFindFirst.mockResolvedValue(null);

    const response = await deletePlayoffMatchAction(matchId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no se puede eliminar/i);
    expect(mockDelete).not.toHaveBeenCalled();
  });

  test('Should delete the match successfully', async () => {
    const response = await deletePlayoffMatchAction(matchId);

    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { id: matchId },
      select: { id: true },
    });
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: matchId } });
    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/encuentro ha sido eliminado correctamente/i);
  });
});
