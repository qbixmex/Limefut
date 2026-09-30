const { mockDeleteMany, mockGetSession } = vi.hoisted(() => ({
  mockDeleteMany: vi.fn(),
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
    standings: {
      deleteMany: mockDeleteMany,
    },
  },
}));

import { deleteStandingsAction } from '@/app/admin/estadisticas/(actions)/delete-standings.action';
import {
  ADMIN_USER_ID,
  CATEGORY_ID,
  TOURNAMENT_ID,
} from '../mocks/standings.mock';

describe('Tests on deleteStandingsAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockGetSession.mockResolvedValue({
      user: { id: ADMIN_USER_ID, roles: ['admin'] },
    });
    mockDeleteMany.mockResolvedValue({ count: 2 });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Authentication', () => {
    test('Should return error when there is no session', async () => {
      mockGetSession.mockResolvedValue(null);

      const response = await deleteStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(response.ok).toBe(false);
      expect(response.message).toMatch(/debes estar autentificado/i);
      expect(mockDeleteMany).not.toHaveBeenCalled();
    });

    test('Should return error when user is not admin', async () => {
      mockGetSession.mockResolvedValue({
        user: { id: ADMIN_USER_ID, roles: ['user'] },
      });

      const response = await deleteStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(response.ok).toBe(false);
      expect(response.message).toMatch(/permisos administrativos/i);
      expect(mockDeleteMany).not.toHaveBeenCalled();
    });

    test('Should return error when roles are null', async () => {
      mockGetSession.mockResolvedValue({
        user: { id: ADMIN_USER_ID, roles: null },
      });

      const response = await deleteStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(response.ok).toBe(false);
      expect(response.message).toMatch(/permisos administrativos/i);
      expect(mockDeleteMany).not.toHaveBeenCalled();
    });

    test('Should return error when roles are empty', async () => {
      mockGetSession.mockResolvedValue({
        user: { id: ADMIN_USER_ID, roles: [] },
      });

      const response = await deleteStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(response.ok).toBe(false);
      expect(response.message).toBe('No tienes permisos administrativos para realizar esta acción');
      expect(mockDeleteMany).not.toHaveBeenCalled();
    });
  });

  describe('Deletion', () => {
    test('Should delete only the standings of the given tournament and category', async () => {
      const response = await deleteStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(response.ok).toBe(true);
      expect(response.message).toMatch(/eliminadas correctamente/i);
      expect(mockDeleteMany).toHaveBeenCalledWith({
        where: { tournamentId: TOURNAMENT_ID, categoryId: CATEGORY_ID },
      });
    });

    test('Should return an error when the deletion fails', async () => {
      mockDeleteMany.mockRejectedValue(new Error('Foreign key constraint failed'));

      const response = await deleteStandingsAction({
        tournamentId: TOURNAMENT_ID,
        categoryId: CATEGORY_ID,
      });

      expect(response.ok).toBe(false);
      expect(response.message).toMatch(/error al eliminar las estadísticas/i);
      expect(mockDeleteMany).toHaveBeenCalledWith({
        where: { tournamentId: TOURNAMENT_ID, categoryId: CATEGORY_ID },
      });
    });
  });
});
