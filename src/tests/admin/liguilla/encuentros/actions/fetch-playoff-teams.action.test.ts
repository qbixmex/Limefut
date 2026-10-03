const { mockPlayoffFindFirst, mockTeamFindMany } = vi.hoisted(() => ({
  mockPlayoffFindFirst: vi.fn(),
  mockTeamFindMany: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    playoff: { findFirst: mockPlayoffFindFirst },
    team: { findMany: mockTeamFindMany },
  },
}));

import { fetchPlayoffTeamsAction } from '@/app/admin/liguilla/[playoff_id]/encuentros/(actions)/fetch-playoff-teams.action';
import { playoffTeamsForSelectMock } from '../mocks/playoff-teams.mock';

const playoffId = '376ec9ed-fd25-4d92-ad26-35b7a354eab1';

describe('Tests on fetchPlayoffTeamsAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => { });
    mockPlayoffFindFirst.mockResolvedValue({
      teamIds: playoffTeamsForSelectMock.map((team) => team.id),
    });
    mockTeamFindMany.mockResolvedValue(playoffTeamsForSelectMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return the teams of the playoff', async () => {
    const response = await fetchPlayoffTeamsAction({ playoffId });

    expect(response.ok).toBe(true);
    expect(response.teams).toEqual(playoffTeamsForSelectMock);
    expect(mockTeamFindMany).toHaveBeenCalledWith({
      where: { id: { in: playoffTeamsForSelectMock.map((team) => team.id) } },
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    });
  });

  test('Should return an error when the playoff does not exist', async () => {
    mockPlayoffFindFirst.mockResolvedValue(null);

    const response = await fetchPlayoffTeamsAction({ playoffId });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no se pudo encontrar la liguilla/i);
    expect(response.teams).toEqual([]);
    expect(mockTeamFindMany).not.toHaveBeenCalled();
  });

  test('Should return the error message when the database throws an Error', async () => {
    mockPlayoffFindFirst.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchPlayoffTeamsAction({ playoffId });

    expect(response.ok).toBe(false);
    expect(response.message).toBe('DB connection failed');
  });

  test('Should return a generic error on unexpected errors', async () => {
    mockPlayoffFindFirst.mockRejectedValue('Something unexpected');

    const response = await fetchPlayoffTeamsAction({ playoffId });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
  });
});
