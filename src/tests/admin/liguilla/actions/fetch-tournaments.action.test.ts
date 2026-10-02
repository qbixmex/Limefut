const { mockFindMany } = vi.hoisted(() => ({
  mockFindMany: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    tournament: {
      findMany: mockFindMany,
    },
  },
}));

import { fetchTournamentsAction } from '@/app/admin/liguilla/(actions)/fetch-tournaments.action';
import { tournamentsMock } from '../mocks/tournaments.mock';

describe('Tests on fetchTournamentsAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return all tournaments', async () => {
    mockFindMany.mockResolvedValue(tournamentsMock);

    const response = await fetchTournamentsAction();

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/torneos fueron obtenidos/i);
    expect(response.tournaments).toEqual(tournamentsMock);
    expect(mockFindMany).toHaveBeenCalledWith({
      orderBy: {
        name: 'desc',
      },
      select: {
        id: true,
        name: true,
        permalink: true,
      },
    });
  });

  test('Should return error when database throws an Error', async () => {
    mockFindMany.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchTournamentsAction();

    expect(response.ok).toBe(false);
    expect(response.message).toBe('DB connection failed');
    expect(response.tournaments).toEqual([]);
  });

  test('Should return error on unexpected server error', async () => {
    mockFindMany.mockRejectedValue('Something unexpected');

    const response = await fetchTournamentsAction();

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.tournaments).toEqual([]);
  });
});
