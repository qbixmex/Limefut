const { mockCategoryFindMany } = vi.hoisted(() => ({
  mockCategoryFindMany: vi.fn(),
}));

vi.mock('next/cache');

vi.mock('@/lib/prisma', () => ({
  default: {
    category: {
      findMany: mockCategoryFindMany,
    },
  },
}));

import { fetchCategoriesForMatchAction } from '@/app/admin/encuentros/(actions)/fetch-categories-for-match.action';

const tournamentPermalink = 'torneo-febrero-junio-2026-edicion-copa-del-mundo';

const categoriesMock = [
  { id: '3f2504e0-4f89-11d3-9a0c-0305e82c3301', name: '2015', permalink: '2015' },
  { id: '3f2504e0-4f89-11d3-9a0c-0305e82c3302', name: '2016', permalink: '2016' },
];

describe('Tests on fetchCategoriesForMatchAction server action', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => { });
    mockCategoryFindMany.mockResolvedValue(categoriesMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Should filter categories linked to the given tournament', async () => {
    await fetchCategoriesForMatchAction(tournamentPermalink);

    const findManyArgs = mockCategoryFindMany.mock.calls[0][0];
    expect(findManyArgs.where).toEqual({
      tournaments: {
        some: {
          tournament: {
            permalink: tournamentPermalink,
          },
        },
      },
    });
  });

  test('Should order categories by name descending', async () => {
    await fetchCategoriesForMatchAction(tournamentPermalink);

    const findManyArgs = mockCategoryFindMany.mock.calls[0][0];
    expect(findManyArgs.orderBy).toEqual([{ name: 'desc' }]);
  });

  test('Should return the categories obtained from the database', async () => {
    const response = await fetchCategoriesForMatchAction(tournamentPermalink);

    expect(response.ok).toBe(true);
    expect(response.message).toMatch(/categorías fueron obtenidos/i);
    expect(response.categories).toEqual(categoriesMock);
  });

  test('Should return the error message when the database throws an Error', async () => {
    mockCategoryFindMany.mockRejectedValue(new Error('DB connection failed'));

    const response = await fetchCategoriesForMatchAction(tournamentPermalink);

    expect(response.ok).toBe(false);
    expect(response.message).toBe('DB connection failed');
    expect(response.categories).toEqual([]);
  });

  test('Should return a generic error on unexpected errors', async () => {
    mockCategoryFindMany.mockRejectedValue('Something unexpected');

    const response = await fetchCategoriesForMatchAction(tournamentPermalink);

    expect(response.ok).toBe(false);
    expect(response.message).toMatch(/error inesperado/i);
    expect(response.categories).toEqual([]);
  });
});
