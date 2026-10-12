const { mockTournamentFindMany } = vi.hoisted(() => ({
  mockTournamentFindMany: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    tournament: { findMany: mockTournamentFindMany },
  },
}));

import { fetchTournamentsForMatchAction } from '@/app/admin/encuentros/(actions)/fetch-tournaments-for-match.action';
import { tournamentsMock } from '../mocks/tournaments.mock';

describe('Tests on fetchTournamentsForMatchAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => { });
    mockTournamentFindMany.mockResolvedValue(tournamentsMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return the active tournaments ordered by name', async () => {
    const response = await fetchTournamentsForMatchAction();

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/torneos fueron obtenidos/i);
    expect(response.tournaments).toEqual(tournamentsMock);
    expect(mockTournamentFindMany).toHaveBeenCalledWith({
      where: { active: true },
      orderBy: [{ name: 'asc' }],
      select: { id: true, name: true, permalink: true },
    });
  });

  test('Should return the error message when the database throws an Error', async () => {
    mockTournamentFindMany.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchTournamentsForMatchAction();

    expect(response.ok).toBe(false);
    expect(response.message).toBe('DB connection failed');
    expect(response.tournaments).toEqual([]);
  });

  test('Should return a generic error on unexpected errors', async () => {
    mockTournamentFindMany.mockRejectedValue('Something unexpected');

    const response = await fetchTournamentsForMatchAction();

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.tournaments).toEqual([]);
  });
});
