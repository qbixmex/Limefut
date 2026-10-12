const { mockMatchFindUnique } = vi.hoisted(() => ({
  mockMatchFindUnique: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    match: { findUnique: mockMatchFindUnique },
  },
}));

import { fetchMatchAction } from '@/app/admin/encuentros/(actions)/fetch-match.action';
import { MATCH_STATUS } from '@/shared/enums';
import { AMERICA, CHIVAS } from '../mocks/teams.mock';
import { LIGA_MX } from '../mocks/tournaments.mock';
import { SUB_15 } from '../mocks/categories.mock';
import { ESTADIO_AZTECA } from '../mocks/fields.mock';

const matchId = '0251b9bf-55e5-48fb-ae2c-6fcdad308d13';
const playerId = '49b70abe-9944-4a33-94a9-b12cb0003719';

const rawMatch = {
  id: matchId,
  field: { id: ESTADIO_AZTECA.id, name: ESTADIO_AZTECA.name },
  matchDate: new Date('2026-05-16T17:00:00.000Z'),
  week: 12,
  referee: 'Fernando García',
  localScore: 2,
  visitorScore: 1,
  status: MATCH_STATUS.COMPLETED,
  createdAt: new Date('2026-04-01T15:30:00.000Z'),
  local: {
    ...AMERICA,
    players: [{ id: playerId, name: 'Luis García' }],
    fields: [{ field: ESTADIO_AZTECA }],
  },
  visitor: {
    ...CHIVAS,
    players: [],
    fields: [],
  },
  category: SUB_15,
  tournament: LIGA_MX,
  penaltyShootout: null,
};

describe('Tests on fetchMatchAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => { });
    mockMatchFindUnique.mockResolvedValue(rawMatch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should return the match mapped to the action type', async () => {
    const response = await fetchMatchAction(matchId);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/encuentro obtenido correctamente/i);
    expect(response.match).toEqual(
      expect.objectContaining({
        id: matchId,
        localTeam: expect.objectContaining({
          ...AMERICA,
          fields: [ESTADIO_AZTECA],
        }),
        visitorTeam: expect.objectContaining(CHIVAS),
        tournament: LIGA_MX,
        category: SUB_15,
      }),
    );
    expect(mockMatchFindUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: matchId } }),
    );
  });

  test('Should default null scores to zero', async () => {
    mockMatchFindUnique.mockResolvedValue({
      ...rawMatch,
      localScore: null,
      visitorScore: null,
    });

    const response = await fetchMatchAction(matchId);

    expect(response.match?.localScore).toBe(0);
    expect(response.match?.visitorScore).toBe(0);
  });

  test('Should return a null match when it does not exist', async () => {
    mockMatchFindUnique.mockResolvedValue(null);

    const response = await fetchMatchAction(matchId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/encuentro no encontrado/i);
    expect(response.match).toBe(null);
  });

  test('Should return the error message when the database throws an Error', async () => {
    mockMatchFindUnique.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchMatchAction(matchId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no se pudo obtener el encuentro/i);
    expect(response.match).toBe(null);
  });

  test('Should return a generic error on unexpected errors', async () => {
    mockMatchFindUnique.mockRejectedValue('Something unexpected');

    const response = await fetchMatchAction(matchId);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.match).toBe(null);
  });
});
