const { mockFindMany, mockCount } = vi.hoisted(() => ({
  mockFindMany: vi.fn(),
  mockCount: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    team: {
      findMany: mockFindMany,
      count: mockCount,
    },
  },
}));

import { fetchAdminTeamsAction } from '@/app/admin/equipos/(actions)/fetch-admin-teams.action';

const tournamentId = '550e8400-e29b-41d4-a716-446655440000';
const categoryId = '660e8400-e29b-41d4-a716-446655440001';

describe('Tests on fetchAdminTeamsAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockFindMany.mockResolvedValue([]);
    mockCount.mockResolvedValue(0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should filter teams by tournament and category', async () => {
    const response = await fetchAdminTeamsAction(tournamentId, categoryId);

    expect(response.ok).toBe(true);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { AND: [{ tournamentId, categoryId }] },
      }),
    );
    expect(mockCount).toHaveBeenCalledWith({
      where: { AND: [{ tournamentId, categoryId }] },
    });
  });

  test('Should filter teams without tournament when tournamentId is "none"', async () => {
    const response = await fetchAdminTeamsAction('none', categoryId);

    expect(response.ok).toBe(true);
    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { AND: [{ tournamentId: null, categoryId }] },
      }),
    );
    expect(mockCount).toHaveBeenCalledWith({
      where: { AND: [{ tournamentId: null, categoryId }] },
    });
  });

  test('Should return error when database throws', async () => {
    mockFindMany.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchAdminTeamsAction(tournamentId, categoryId);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('DB connection failed');
    expect(response.teams).toEqual([]);
    expect(response.pagination).toEqual({ currentPage: 0, totalPages: 0 });
  });
});
