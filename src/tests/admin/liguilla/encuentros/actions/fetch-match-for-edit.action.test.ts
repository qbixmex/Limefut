const { mockMatchFindFirst } = vi.hoisted(() => ({
  mockMatchFindFirst: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    playoffMatch: { findFirst: mockMatchFindFirst },
  },
}));

import { fetchMatchForEditAction } from '@/app/admin/liguilla/[playoff_id]/encuentros/(actions)/fetch-match-for-edit.action';
import { MATCH_ID, PLAYOFF_ID, playoffMatchForEditMock } from '../mocks/playoff-match-for-edit.mock';

const rawPrismaMatch = {
  id: playoffMatchForEditMock.id,
  matchDate: playoffMatchForEditMock.matchDate,
  referee: playoffMatchForEditMock.referee,
  localScore: playoffMatchForEditMock.localScore,
  visitorScore: playoffMatchForEditMock.visitorScore,
  status: playoffMatchForEditMock.status,
  group: playoffMatchForEditMock.group,
  round: playoffMatchForEditMock.round,
  remarks: playoffMatchForEditMock.remarks,
  local: playoffMatchForEditMock.localTeam,
  visitor: playoffMatchForEditMock.visitorTeam,
  fieldId: playoffMatchForEditMock.fieldId,
  penaltyShootout: playoffMatchForEditMock.penaltyShootout,
};

describe('Tests on fetchMatchForEditAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => { });
    mockMatchFindFirst.mockResolvedValue(rawPrismaMatch);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should returns the match for edit action', async () => {
    const response = await fetchMatchForEditAction({
      playoffId: PLAYOFF_ID,
      matchId: MATCH_ID,
    });

    expect(response.ok).toBe(true);
    expect(response.match).toEqual(playoffMatchForEditMock);
    expect(mockMatchFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: MATCH_ID, playoffId: PLAYOFF_ID },
      }),
    );
  });

  test('Should return an error when the match does not exist', async () => {
    mockMatchFindFirst.mockResolvedValue(null);

    const response = await fetchMatchForEditAction({
      playoffId: PLAYOFF_ID,
      matchId: MATCH_ID,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/encuentro no existe/i);
    expect(response.match).toBe(null);
  });

  test('Should return an error when the database throws an Error', async () => {
    mockMatchFindFirst.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchMatchForEditAction({
      playoffId: PLAYOFF_ID,
      matchId: MATCH_ID,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/no se pudo obtener el encuentro/i);
    expect(response.match).toBe(null);
  });

  test('Should return a generic error on unexpected errors', async () => {
    mockMatchFindFirst.mockRejectedValue('Something unexpected');

    const response = await fetchMatchForEditAction({
      playoffId: PLAYOFF_ID,
      matchId: MATCH_ID,
    });

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.match).toBe(null);
  });
});
