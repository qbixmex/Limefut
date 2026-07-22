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

import { fetchTournamentAction } from '@/app/admin/torneos/(actions)';
import { tournamentMock } from '../mocks/tournament.mock';

const { categories, teamsQuantity, ...restOfTournament } = tournamentMock;
const prismaTournament = {
  ...restOfTournament,
  categories: categories.map(c => ({
    category: {
      id: c.id,
      name: c.name,
      permalink: c.permalink,
    },
    tournamentId: tournamentMock.id,
    categoryId: c.id,
  })),
  _count: {
    teams: teamsQuantity,
  },
};

describe('Tests on tournament server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return a tournament', async () => {
    mockFindFirst.mockResolvedValue(prismaTournament);

    const response = await fetchTournamentAction(
      tournamentMock.id,
      ['user', 'admin'],
    );

    expect(response.ok).toBe(true);
    expect(response.message).toContain('Torneo obtenido correctamente');

    expect(response.tournament?.id).toBe(tournamentMock.id);
    expect(response.tournament?.name).toBe(tournamentMock.name);
    expect(response.tournament?.permalink).toBe(tournamentMock.permalink);
    expect(response.tournament?.imageUrl).toBe(tournamentMock.imageUrl);
    expect(response.tournament?.description).toBe(tournamentMock.description);
    expect(response.tournament?.country).toBe(tournamentMock.country);
    expect(response.tournament?.cities).toBe(tournamentMock.cities);
    expect(response.tournament?.season).toBe(tournamentMock.season);
    expect(response.tournament?.startDate).toBe(tournamentMock.startDate);
    expect(response.tournament?.endDate).toBe(tournamentMock.endDate);
    expect(response.tournament?.active).toBe(tournamentMock.active);
    expect(response.tournament?.createdAt).toBe(tournamentMock.createdAt);
    expect(response.tournament?.updatedAt).toBe(tournamentMock.updatedAt);
    expect(response.tournament?.categories).toEqual(tournamentMock.categories);
    expect(response.tournament?.teamsQuantity).toEqual(tournamentMock.teamsQuantity);

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
        createdAt: true,
        updatedAt: true,
        categories: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
                permalink: true,
              },
            },
          },
        },
        _count: {
          select: { teams: true },
        },
      },
    });
  });

  test('Should not return a tournament when userRoles is null', async () => {
    const response = await fetchTournamentAction(tournamentMock.id, null);

    expect(response.ok).toBe(false);
    expect(response.tournament).toBe(null);
    expect(response.message).toContain('permisos administrativos');
    expect(mockFindFirst).not.toHaveBeenCalled();
  });

  test('Should return error when user does not have admin role', async () => {
    const response = await fetchTournamentAction(
      tournamentMock.id,
      ['user'],
    );

    expect(response.ok).toBe(false);
    expect(response.message).toContain('permisos administrativos');
    expect(response.tournament).toBe(null);
    expect(mockFindFirst).not.toHaveBeenCalled();
  });

  test('Should return error when tournament is not found', async () => {
    mockFindFirst.mockResolvedValue(null);

    const response = await fetchTournamentAction(
      'dc233c07-9790-439f-9f50-88b86a13eb62',
      ['user', 'admin'],
    );

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Torneo no encontrado');
    expect(response.tournament).toBe(null);
  });

  test('Should return error when database throws', async () => {
    mockFindFirst.mockRejectedValue(new Error('DB error'));

    const response = await fetchTournamentAction(
      tournamentMock.id,
      ['user', 'admin'],
    );

    expect(response.ok).toBe(false);
    expect(response.message).toContain('No se pudo obtener el torneo');
    expect(response.tournament).toBeNull();
  });

  test('Should return error when unexpected server error occurs', async () => {
    mockFindFirst.mockRejectedValue('Unexpected error');

    const response = await fetchTournamentAction(
      tournamentMock.id,
      ['user', 'admin'],
    );

    expect(response.ok).toBe(false);
    expect(response.message).toContain('Error inesperado');
    expect(response.tournament).toBeNull();
  });
});
