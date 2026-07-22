const { mockFindFirst } = vi.hoisted(() => ({
  mockFindFirst: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    tournament: {
      findFirst: mockFindFirst,
    },
  },
}));

import { fetchTournamentForEditAction } from '@/app/admin/torneos/(actions)/fetch-tournament-for-edit.action';
import { tournamentMock } from '../mocks/tournament.mock';

const prismaTournament = {
  id: tournamentMock.id,
  name: tournamentMock.name,
  permalink: tournamentMock.permalink,
  imageUrl: tournamentMock.imageUrl,
  imagePublicID: tournamentMock.imagePublicID,
  description: tournamentMock.description,
  country: tournamentMock.country,
  cities: tournamentMock.cities,
  season: tournamentMock.season,
  startDate: tournamentMock.startDate,
  endDate: tournamentMock.endDate,
  active: tournamentMock.active,
  categories: tournamentMock.categories.map(c => ({
    categoryId: c.id,
  })),
};

describe('Tests on tournament for edit server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Should return a tournament for edit', async () => {
    mockFindFirst.mockResolvedValue(prismaTournament);

    const response = await fetchTournamentForEditAction({
      tournamentId: tournamentMock.id,
      authenticatedUserId: '4b0093588a486f510eac',
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(true);
    expect(response.message).toContain('obtenido correctamente');

    expect(response.tournament?.id).toBe(tournamentMock.id);
    expect(response.tournament?.name).toBe(tournamentMock.name);
    expect(response.tournament?.permalink).toBe(tournamentMock.permalink);
    expect(response.tournament?.imageUrl).toBe(tournamentMock.imageUrl);
    expect(response.tournament?.imagePublicID).toBe(tournamentMock.imagePublicID);
    expect(response.tournament?.description).toBe(tournamentMock.description);
    expect(response.tournament?.country).toBe(tournamentMock.country);
    expect(response.tournament?.cities).toBe(tournamentMock.cities);
    expect(response.tournament?.season).toBe(tournamentMock.season);
    expect(response.tournament?.startDate).toBe(tournamentMock.startDate);
    expect(response.tournament?.endDate).toBe(tournamentMock.endDate);
    expect(response.tournament?.active).toBe(tournamentMock.active);
    expect(response.tournament?.categoriesIds).toEqual(
      tournamentMock.categories.map(c => c.id),
    );

    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { id: tournamentMock.id },
      select: {
        id: true,
        name: true,
        permalink: true,
        imageUrl: true,
        imagePublicID: true,
        description: true,
        country: true,
        cities: true,
        season: true,
        startDate: true,
        endDate: true,
        active: true,
        categories: {
          select: {
            categoryId: true,
          },
        },
      },
    });
  });

  test('Should return error when authenticatedUserId is undefined', async () => {
    const response = await fetchTournamentForEditAction({
      tournamentId: tournamentMock.id,
      authenticatedUserId: undefined,
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.tournament).toBeNull();
    expect(response.message).toContain('autentificado');
    expect(mockFindFirst).not.toHaveBeenCalled();
  });

  test('Should return error when authenticatedUserRoles is null', async () => {
    const response = await fetchTournamentForEditAction({
      tournamentId: tournamentMock.id,
      authenticatedUserId: '4b0093588a486f510eac',
      authenticatedUserRoles: null,
    });

    expect(response.ok).toBe(false);
    expect(response.tournament).toBeNull();
    expect(response.message).toContain('permisos administrativos');
    expect(mockFindFirst).not.toHaveBeenCalled();
  });

  test('Should return error when authenticatedUserRoles is undefined', async () => {
    const response = await fetchTournamentForEditAction({
      tournamentId: tournamentMock.id,
      authenticatedUserId: '4b0093588a486f510eac',
      authenticatedUserRoles: undefined,
    });

    expect(response.ok).toBe(false);
    expect(response.tournament).toBeNull();
    expect(response.message).toContain('permisos administrativos');
    expect(mockFindFirst).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    const response = await fetchTournamentForEditAction({
      tournamentId: tournamentMock.id,
      authenticatedUserId: '4b0093588a486f510eac',
      authenticatedUserRoles: ['user'],
    });

    expect(response.ok).toBe(false);
    expect(response.tournament).toBeNull();
    expect(response.message).toContain('permisos administrativos');
    expect(mockFindFirst).not.toHaveBeenCalled();
  });

  test('Should return error when tournament is not found', async () => {
    mockFindFirst.mockResolvedValue(null);

    const response = await fetchTournamentForEditAction({
      tournamentId: 'dc233c07-9790-439f-9f50-88b86a13eb62',
      authenticatedUserId: '4b0093588a486f510eac',
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('no existe');
    expect(response.tournament).toBeNull();
  });

  test('Should return error when database throws', async () => {
    mockFindFirst.mockRejectedValue(new Error('DB error'));

    const response = await fetchTournamentForEditAction({
      tournamentId: tournamentMock.id,
      authenticatedUserId: '4b0093588a486f510eac',
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('No se pudo obtener');
    expect(response.tournament).toBeNull();
  });

  test('Should return error when unexpected server error occurs', async () => {
    mockFindFirst.mockRejectedValue('Unexpected error');

    const response = await fetchTournamentForEditAction({
      tournamentId: tournamentMock.id,
      authenticatedUserId: '4b0093588a486f510eac',
      authenticatedUserRoles: ['user', 'admin'],
    });

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Error inesperado');
    expect(response.tournament).toBeNull();
  });
});
