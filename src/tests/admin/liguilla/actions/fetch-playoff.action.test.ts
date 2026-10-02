const { mockFindFirst, mockTeamFindMany } = vi.hoisted(() => ({
  mockFindFirst: vi.fn(),
  mockTeamFindMany: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    playoff: {
      findFirst: mockFindFirst,
    },
    team: {
      findMany: mockTeamFindMany,
    },
  },
}));

import { fetchPlayoffAction } from '@/app/admin/liguilla/(actions)/fetch-playoff.action';
import { playoffTeamsMock } from '../mocks/playoff.mock';

const playoffId = '376ec9ed-fd25-4d92-ad26-35b7a354eab1';
const [teamA, teamB, teamC] = playoffTeamsMock;

const mockPlayoff = {
  id: playoffId,
  teamIds: [teamC.id, teamA.id, teamB.id],
  startingRound: 'quarterfinal',
  tournament: {
    id: '0a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d',
    name: 'Torneo de Apertura 2026',
  },
  category: { name: 'Varonil' },
};

describe('Tests on fetchPlayoffAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => { });
    mockFindFirst.mockResolvedValue(mockPlayoff);
    mockTeamFindMany.mockResolvedValue([teamA, teamB, teamC]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return the playoff with teams ordered by teamIds', async () => {
    const response = await fetchPlayoffAction(playoffId);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/liguilla fue obtenida/i);
    expect(response.playoff?.id).toBe(playoffId);
    expect(response.playoff?.startingRound).toBe('quarterfinal');
    expect(response.playoff?.tournament).toEqual(mockPlayoff.tournament);
    expect(response.playoff?.teams.map((team) => team.id)).toEqual([
      teamC.id,
      teamA.id,
      teamB.id,
    ]);
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { id: playoffId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        teamIds: true,
        startingRound: true,
        tournament: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: { name: true },
        },
      },
    });
  });

  test('Should filter out teams that no longer exist', async () => {
    mockFindFirst.mockResolvedValue({
      ...mockPlayoff,
      teamIds: [teamA.id, '00000000-0000-4000-8000-000000000000'],
    });
    mockTeamFindMany.mockResolvedValue([teamA]);

    const response = await fetchPlayoffAction(playoffId);

    expect(response.ok).toBe(true);
    expect(response.playoff?.teams).toHaveLength(1);
    expect(response.playoff?.teams[0].id).toBe(teamA.id);
  });

  test('Should return error when playoff does not exist', async () => {
    mockFindFirst.mockResolvedValue(null);

    const response = await fetchPlayoffAction(playoffId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no se pudo obtener detalles/i);
    expect(response.playoff).toBe(null);
    expect(mockTeamFindMany).not.toHaveBeenCalled();
  });

  test('Should return undefined category when the playoff has no category', async () => {
    mockFindFirst.mockResolvedValue({ ...mockPlayoff, category: null });

    const response = await fetchPlayoffAction(playoffId);

    expect(response.ok).toBe(true);
    expect(response.playoff?.category).toBeUndefined();
  });

  test('Should return error when database throws an Error', async () => {
    mockFindFirst.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchPlayoffAction(playoffId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('DB connection failed');
    expect(response.playoff).toBe(null);
  });

  test('Should return error on unexpected server error', async () => {
    mockFindFirst.mockRejectedValue('Something unexpected');

    const response = await fetchPlayoffAction(playoffId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.playoff).toBe(null);
  });
});
