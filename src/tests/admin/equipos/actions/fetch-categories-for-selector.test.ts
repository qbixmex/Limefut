const { mockFindMany } = vi.hoisted(() => ({
  mockFindMany: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    category: {
      findMany: mockFindMany,
    },
  },
}));

import { fetchCategoriesForSelectorAction } from '@/shared/actions/fetch-categories-for-selector.action';

describe('Tests on fetchCategoriesForSelectorAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    mockFindMany.mockResolvedValue([]);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should fetch categories linked to the given tournament', async () => {
    const response = await fetchCategoriesForSelectorAction('torneo-a');

    expect(response.ok).toBe(true);
    expect(mockFindMany).toHaveBeenCalledWith({
      orderBy: [{ name: 'desc' }],
      where: {
        tournaments: {
          some: { tournament: { permalink: 'torneo-a' } },
        },
      },
      select: { id: true, name: true, permalink: true },
    });
  });

  test('Should fetch categories with teams without tournament when permalink is "none"', async () => {
    const response = await fetchCategoriesForSelectorAction('none');

    expect(response.ok).toBe(true);
    expect(mockFindMany).toHaveBeenCalledWith({
      orderBy: [{ name: 'desc' }],
      where: {
        teams: {
          some: { tournamentId: null },
        },
      },
      select: { id: true, name: true, permalink: true },
    });
  });

  test('Should return error when database throws', async () => {
    mockFindMany.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchCategoriesForSelectorAction('torneo-a');

    expect(response.ok).toBe(false);
    expect(response.message).toBe('DB connection failed');
    expect(response.categories).toEqual([]);
  });
});
